import * as X from "@xieyuheng/x-data.js"
import { arrayMapZip } from "../../utils/array/arrayMapZip.ts"
import { errorReport } from "../../utils/error/errorReport.ts"
import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { apply } from "./apply.ts"
import { the } from "./the.ts"

export function applyWithSchema(
  schema: Value,
  target: Value,
  args: Array<Value>,
): Value {
  schema = Values.lazyWalk(schema)
  target = Values.lazyWalk(target)

  const meta = Values.valueMaybeMeta(target)

  if (schema.kind === "Arrow") {
    const arrow = Values.arrowNormalize(schema)

    if (arrow.argSchemas.length < args.length) {
      let message = `[applyWithSchema] too many arguments\n`
      message += `  args: [${args.map(formatValue).join(" ")}]\n`
      message += `  schema: ${formatValue(schema)}\n`
      message += `  target: ${formatValue(target)}\n`
      if (meta) throw new X.ErrorWithMeta(message, meta)
      else throw new Error(message)
    }

    try {
      if (arrow.argSchemas.length === args.length) {
        const claimedArgs = arrayMapZip(the, arrow.argSchemas, args)
        const result = apply(target, claimedArgs)
        if (validateResult(arrow.retSchema, result)) {
          return result
        } else {
          let message = `[applyWithSchema] fail to validate the result\n`
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
        const claimedArgs = arrayMapZip(the, argSchemas, args)
        const result = apply(target, claimedArgs)
        const newArrow = Values.Arrow(restArgSchemas, arrow.retSchema)
        return the(newArrow, result)
      }
    } catch (error) {
      let message = errorReport(error)

      message += `[applyWithSchema] fail to validate an argument (due to the error above)\n`
      message += `  args: [${args.map(formatValue).join(" ")}]\n`
      message += `  schema: ${formatValue(schema)}\n`
      message += `  target: ${formatValue(target)}\n`
      if (meta) throw new X.ErrorWithMeta(message, meta)
      else throw new Error(message)
    }
  }

  let message = `[applyWithSchema] unhandled kind of schema\n`
  message += `  args: [${args.map(formatValue).join(" ")}]\n`
  message += `  schema: ${formatValue(schema)}\n`
  message += `  target: ${formatValue(target)}\n`
  if (meta) throw new X.ErrorWithMeta(message, meta)
  else throw new Error(message)
}

function validateResult(schema: Value, value: Value): boolean {
  const result = apply(schema, [value])

  if (result.kind === "Bool") {
    return result.content
  }

  let message = `[validateResult] expect result to be bool\n`
  message += `  result: ${formatValue(result)}\n`
  message += `  schema: ${formatValue(schema)}\n`
  message += `  value: ${formatValue(value)}\n`
  throw new Error(message)
}
