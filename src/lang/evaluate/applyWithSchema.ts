import { arrayZip } from "../../utils/array/arrayZip.ts"
import { errorReport } from "../../utils/error/errorReport.ts"
import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { apply } from "./apply.ts"
import { the } from "./the.ts"
import { validate } from "./validate.ts"

export function applyWithSchema(
  schema: Value,
  target: Value,
  args: Array<Value>,
): Value {
  schema = Values.lazyWalk(schema)
  target = Values.lazyWalk(target)

  if (schema.kind === "Arrow") {
    const arrow = Values.arrowNormalize(schema)

    if (arrow.argSchemas.length < args.length) {
      let message = `[applyWithSchema] too many arguments\n`
      message += `  schema: ${formatValue(schema)}\n`
      message += `  target: ${formatValue(target)}\n`
      message += `  args: [${args.map(formatValue).join(" ")}]\n`
      throw new Error(message)
    }

    try {
      if (arrow.argSchemas.length === args.length) {
        const claimedArgs = arrayZip(arrow.argSchemas, args).map(
          ([schema, arg]) => the(schema, arg),
        )
        const result = apply(target, claimedArgs)
        if (validate(arrow.retSchema, result)) {
          return result
        } else {
          let message = `[applyWithSchema] fail to validate the result\n`
          message += `  schema: ${formatValue(schema)}\n`
          message += `  target: ${formatValue(target)}\n`
          message += `  args: [${args.map(formatValue).join(" ")}]\n`
          message += `  result: ${formatValue(result)}\n`
          throw new Error(message)
        }
      }

      if (arrow.argSchemas.length > args.length) {
        const argSchemas = arrow.argSchemas.slice(0, args.length)
        const restArgSchemas = arrow.argSchemas.slice(args.length)
        const claimedArgs = arrayZip(argSchemas, args).map(([schema, arg]) =>
          the(schema, arg),
        )
        const result = apply(target, claimedArgs)
        const newArrow = Values.Arrow(restArgSchemas, arrow.retSchema)
        return the(newArrow, result)
      }
    } catch (error) {
      let message = `[applyWithSchema] fail to validate an argument\n`
      message += `  schema: ${formatValue(schema)}\n`
      message += `  target: ${formatValue(target)}\n`
      message += `  args: [${args.map(formatValue).join(" ")}]\n`
      message += errorReport(error)
      throw new Error(message)
    }
  }

  let message = `[applyWithSchema] unhandled kind of schema\n`
  message += `  schema: ${formatValue(schema)}\n`
  message += `  target: ${formatValue(target)}\n`
  message += `  args: [${args.map(formatValue).join(" ")}]\n`
  throw new Error(message)
}
