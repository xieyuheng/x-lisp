import { arrayZip } from "../../utils/array/arrayZip.ts"
import { formatValue } from "../format/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"
import { apply } from "./apply.ts"
import { the } from "./the.ts"

export function applyWithSchema(
  schema: Value,
  target: Value,
  args: Array<Value>,
): Value {
  if (schema.kind === "Arrow") {
    const arrow = Values.arrowNormalize(schema)

    if (arrow.argSchemas.length < args.length) {
      let message = `[applyWithSchema] too many arguments\n`
      message += `  arg schemas: [${schema.argSchemas.map(formatValue).join(" ")}]\n`
      message += `  args: [${args.map(formatValue).join(" ")}]\n`
      throw new Error(message)
    }

    if (arrow.argSchemas.length === args.length) {
      const claimedArgs = arrayZip(arrow.argSchemas, args).map(
        ([schema, arg]) => the(schema, arg),
      )
      const result = apply(target, claimedArgs)
      return the(arrow.retSchema, result)
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
  }

  let message = `[applyWithSchema] unhandled kind of schema\n`
  message += `  schema: ${formatValue(schema)}\n`
  throw new Error(message)
}
