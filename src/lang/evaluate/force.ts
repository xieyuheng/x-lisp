import { flags } from "../../flags.ts"
import { globals } from "../../globals.ts"
import { formatUnderTag } from "../../helper/format/formatUnderTag.ts"
import { prettyValue } from "../pretty/index.ts"
import { type Value } from "../value/index.ts"
import { applyVariadicLambda } from "./applyVariadicLambda.ts"
import { evaluate, resultValue } from "./evaluate.ts"
import { forceWithSchema } from "./forceWithSchema.ts"

export function force(target: Value): Value {
  const maxWidth = globals.maxWidth

  if (target.kind === "NullaryLambda") {
    return resultValue(evaluate(target.body)(target.mod, target.env))
  }

  if (target.kind === "VariadicLambda") {
    return applyVariadicLambda(target, [])
  }

  if (target.kind === "PrimitiveNullaryLambda") {
    return target.fn()
  }

  if (target.kind === "The") {
    if (flags.debug) {
      return forceWithSchema(target.schema, target.value)
    } else {
      return force(target.value)
    }
  }

  let message = `[force] unhandled target value kind`
  message += formatUnderTag(2, `target:`, prettyValue(maxWidth, target))
  throw new Error(message)
}
