import { flags } from "../../flags.ts"
import { globals } from "../../globals.ts"
import { formatUnderTag } from "../../helpers/format/formatUnderTag.ts"
import { prettyValue } from "../pretty/index.ts"
import { type Value } from "../value/index.ts"
import { applyNullaryWithSchema } from "./applyNullaryWithSchema.ts"
import { applyVariadicLambda } from "./applyVariadicLambda.ts"
import { evaluate, resultValue } from "./evaluate.ts"

export function applyNullary(target: Value): Value {
  const maxWidth = globals.maxWidth

  if (target.kind === "NullaryLambda") {
    return resultValue(evaluate(target.body)(target.mod, target.env))
  }

  if (target.kind === "VariadicLambda") {
    return applyVariadicLambda(target, [])
  }

  if (target.kind === "PrimitiveNullaryFunction") {
    return target.fn()
  }

  if (target.kind === "The") {
    if (flags.debug) {
      return applyNullaryWithSchema(target.schema, target.value)
    } else {
      return applyNullary(target.value)
    }
  }

  let message = `[applyNullary] unhandled target value kind`
  message += formatUnderTag(2, `target:`, prettyValue(maxWidth, target))
  throw new Error(message)
}
