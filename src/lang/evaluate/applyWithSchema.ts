import * as X from "@xieyuheng/x-data.js"
import { arrayMapZip } from "../../utils/array/arrayMapZip.ts"
import { indent } from "../../utils/format/indent.ts"
import { formatValue, formatValues } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { apply } from "./apply.ts"
import { applyPolymorphicWithAnythings } from "./applyPolymorphic.ts"
import { validate, validateOrFail } from "./validate.ts"

export function applyWithSchema(
  schema: Value,
  target: Value,
  args: Array<Value>,
): Value {
  const meta = Values.valueMaybeMeta(target)
  const context = { schema, target, args }

  if (schema.kind === "Polymorphic") {
    return applyWithSchema(applyPolymorphicWithAnythings(schema), target, args)
  }

  if (schema.kind === "VariadicArrow") {
    const argSchemas = Array(args.length).fill(schema.argSchema)
    const checkedArgs = validateArgs(context, argSchemas, args)
    const ret = apply(target, checkedArgs)
    const result = validate(schema.retSchema, ret)
    if (result.kind === "Err") {
      let message = `[applyWithSchema] fail on result`
      message += `\n  schema: ${formatValue(schema)}`
      message += `\n  target: ${formatValue(target)}`
      message += `\n  args: [${formatValues(args)}]`
      message += `\n  result: ${formatValue(ret)}`
      if (meta) throw new X.ErrorWithMeta(message, meta)
      else throw new Error(message)
    }

    return result.value
  }

  if (schema.kind === "Arrow") {
    if (schema.argSchemas.length < args.length) {
      const usedArgs = args.slice(0, schema.argSchemas.length)
      const spilledArgs = args.slice(schema.argSchemas.length)
      const checkedArgs = validateArgs(context, schema.argSchemas, usedArgs)
      const ret = apply(target, checkedArgs)
      const result = validate(schema.retSchema, ret)
      if (result.kind === "Err") {
        let message = `[applyWithSchema] fail on result`
        message += `\n  schema: ${formatValue(schema)}`
        message += `\n  target: ${formatValue(target)}`
        message += `\n  used args: [${formatValues(usedArgs)}]`
        message += `\n  spilled args: [${formatValues(spilledArgs)}]`
        message += `\n  result: ${formatValue(ret)}`
        if (meta) throw new X.ErrorWithMeta(message, meta)
        else throw new Error(message)
      }

      return apply(result.value, spilledArgs)
    }

    if (schema.argSchemas.length === args.length) {
      const checkedArgs = validateArgs(context, schema.argSchemas, args)
      const ret = apply(target, checkedArgs)
      const result = validate(schema.retSchema, ret)
      if (result.kind === "Err") {
        let message = `[applyWithSchema] fail on result`
        message += `\n  schema: ${formatValue(schema)}`
        message += `\n  target: ${formatValue(target)}`
        message += `\n  args: [${formatValues(args)}]`
        message += `\n  result: ${formatValue(ret)}`
        if (meta) throw new X.ErrorWithMeta(message, meta)
        else throw new Error(message)
      }

      return result.value
    }

    if (schema.argSchemas.length > args.length) {
      const argSchemas = schema.argSchemas.slice(0, args.length)
      const restArgSchemas = schema.argSchemas.slice(args.length)
      const result = apply(target, validateArgs(context, argSchemas, args))
      const newArrow = Values.Arrow(restArgSchemas, schema.retSchema)
      return validateOrFail(newArrow, result)
    }
  }

  let message = `[applyWithSchema] unhandled kind of schema`
  message += `\n  schema: ${formatValue(schema)}`
  message += `\n  target: ${formatValue(target)}`
  message += `\n  args: [${formatValues(args)}]`
  if (meta) throw new X.ErrorWithMeta(message, meta)
  else throw new Error(message)
}

type Context = {
  args: Array<Value>
  schema: Value
  target: Value
}

function validateArgs(
  context: Context,
  argSchemas: Array<Value>,
  args: Array<Value>,
): Array<Value> {
  const validatedArgs: Array<Value> = []
  const erred: Array<{ index: number; schema: Value; arg: Value }> = []
  for (const [index, result] of arrayMapZip(
    validate,
    argSchemas,
    args,
  ).entries()) {
    if (result.kind === "Ok") {
      validatedArgs.push(result.value)
    } else {
      erred.push({
        index,
        schema: argSchemas[index],
        arg: args[index],
      })
    }
  }

  if (erred.length === 0) {
    return validatedArgs
  }

  const meta = Values.valueMaybeMeta(context.target)
  let message = `[applyWithSchema] fail on arguments`
  message += `\n  schema:`
  message += indent(4, `\n` + formatValue(context.schema))
  message += `\n  target:`
  message += indent(4, `\n` + formatValue(context.target))
  message += `\n  args:`
  message += indent(4, `\n` + `[${formatValues(context.args)}]`)
  message += `\n  failed args:`
  for (const { index, schema, arg } of erred) {
    message += `\n  - count: ${index + 1}`
    message += `\n    schema:`
    message += indent(6, `\n` + formatValue(schema))
    message += `\n    value:`
    message += indent(6, `\n` + formatValue(arg))
  }

  if (meta) throw new X.ErrorWithMeta(message, meta)
  else throw new Error(message)
}
