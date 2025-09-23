import * as X from "@xieyuheng/x-data.js"
import { arrayMapZip } from "../../utils/array/arrayMapZip.ts"
import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { apply } from "./apply.ts"
import { validate, validateOrFail } from "./validate.ts"

export function applyWithSchema(
  schema: Value,
  target: Value,
  args: Array<Value>,
): Value {
  schema = Values.lazyWalk(schema)
  target = Values.lazyWalk(target)

  const meta = Values.valueMaybeMeta(target)
  const context = { schema, target, args }

  if (schema.kind === "Arrow") {
    const arrow = Values.arrowNormalize(schema)

    if (arrow.argSchemas.length < args.length) {
      let message = `(validation) too many arguments\n`
      message += `  args: [${args.map(formatValue).join(" ")}]\n`
      message += `  schema: ${formatValue(schema)}\n`
      message += `  target: ${formatValue(target)}\n`
      if (meta) throw new X.ErrorWithMeta(message, meta)
      else throw new Error(message)
    }

    if (arrow.argSchemas.length === args.length) {
      const result = apply(
        target,
        validateArgs(context, arrow.argSchemas, args),
      )
      if (resultIsValid(arrow.retSchema, result)) {
        return result
      } else {
        let message = `(validation) fail on result\n`
        message += `  args: [${args.map(formatValue).join(" ")}]\n`
        message += `  result: ${formatValue(result)}\n`
        message += `  schema: ${formatValue(schema)}\n`
        message += `  target: ${formatValue(target)}\n`
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

  let message = `(validation) unhandled kind of schema\n`
  message += `  args: [${args.map(formatValue).join(" ")}]\n`
  message += `  schema: ${formatValue(schema)}\n`
  message += `  target: ${formatValue(target)}\n`
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
  let message = `(validation) fail on arguments\n`
  message += `  args: [${context.args.map(formatValue).join(" ")}]\n`
  for (const { index, schema, arg } of erred) {
    message += `    #${index}: (the ${formatValue(schema)} ${formatValue(arg)})\n`
  }

  message += `  schema: ${formatValue(context.schema)}\n`
  message += `  target: ${formatValue(context.target)}\n`
  if (meta) throw new X.ErrorWithMeta(message, meta)
  else throw new Error(message)
}

function resultIsValid(schema: Value, value: Value): boolean {
  const result = apply(schema, [value])

  if (Values.isBool(result)) {
    return Values.isTrue(result)
  }

  let message = `(validation) expect result to be bool\n`
  message += `  result: ${formatValue(result)}\n`
  message += `  schema: ${formatValue(schema)}\n`
  message += `  value: ${formatValue(value)}\n`
  throw new Error(message)
}
