import * as X from "@xieyuheng/x-data.js"
import { arrayMapZip } from "../../utils/array/arrayMapZip.ts"
import { formatValue, formatValues } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { apply } from "./apply.ts"
import { applyPolymorphicWithAnythings } from "./applyPolymorphic.ts"
import { isValid, validate, validateOrFail } from "./validate.ts"

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
    const result = apply(
      target,
      validateArgs(
        context,
        args.map((_) => schema.argSchema),
        args,
      ),
    )

    if (isValid(schema.retSchema, result)) {
      return result
    } else {
      let message = `[applyWithSchema] fail on result`
      message += `\n  schema: ${formatValue(schema)}`
      message += `\n  target: ${formatValue(target)}`
      message += `\n  args: [${formatValues(args)}]`
      message += `\n  result: ${formatValue(result)}`
      if (meta) throw new X.ErrorWithMeta(message, meta)
      else throw new Error(message)
    }
  }

  if (schema.kind === "Arrow") {
    const arrow = Values.arrowNormalize(schema)

    if (arrow.argSchemas.length < args.length) {
      const usedArgs = args.slice(0, arrow.argSchemas.length)
      const spilledArgs = args.slice(arrow.argSchemas.length)
      const result = apply(
        target,
        validateArgs(context, arrow.argSchemas, usedArgs),
      )

      if (isValid(arrow.retSchema, result)) {
        return apply(result, spilledArgs)
      } else {
        let message = `[applyWithSchema] fail on result`
        message += `\n  schema: ${formatValue(schema)}`
        message += `\n  target: ${formatValue(target)}`
        message += `\n  used args: [${formatValues(usedArgs)}]`
        message += `\n  spilled args: [${formatValues(spilledArgs)}]`
        message += `\n  result: ${formatValue(result)}`
        if (meta) throw new X.ErrorWithMeta(message, meta)
        else throw new Error(message)
      }
    }

    if (arrow.argSchemas.length === args.length) {
      const result = apply(
        target,
        validateArgs(context, arrow.argSchemas, args),
      )
      if (isValid(arrow.retSchema, result)) {
        return result
      } else {
        let message = `[applyWithSchema] fail on result`
        message += `\n  schema: ${formatValue(schema)}`
        message += `\n  target: ${formatValue(target)}`
        message += `\n  args: [${formatValues(args)}]`
        message += `\n  result: ${formatValue(result)}`
        if (meta) throw new X.ErrorWithMeta(message, meta)
        else throw new Error(message)
      }
    }

    if (arrow.argSchemas.length > args.length) {
      const argSchemas = arrow.argSchemas.slice(0, args.length)
      const restArgSchemas = arrow.argSchemas.slice(args.length)
      const result = apply(target, validateArgs(context, argSchemas, args))
      const newArrow = Values.Arrow(restArgSchemas, arrow.retSchema)
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
  message += `\n  schema: ${formatValue(context.schema)}`
  message += `\n  target: ${formatValue(context.target)}`
  message += `\n  args: [${formatValues(context.args)}]`
  message += `\n  failed args:`
  for (const { index, schema, arg } of erred) {
    message += `\n  - count: ${index + 1}`
    message += `\n    schema: ${formatValue(schema)}`
    message += `\n    value: ${formatValue(arg)}`
  }

  if (meta) throw new X.ErrorWithMeta(message, meta)
  else throw new Error(message)
}
