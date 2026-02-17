import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import { textWidth } from "../../config.ts"
import { flags } from "../../flags.ts"
import { prettyValue } from "../pretty/index.ts"
import { type Value } from "../value/index.ts"
import { applyNullaryWithSchema } from "./applyNullaryWithSchema.ts"
import { applyVariadicClosure } from "./applyVariadicClosure.ts"
import { evaluate, resultValue } from "./evaluate.ts"

export function applyNullary(target: Value): Value {
  const width = textWidth

  if (target.kind === "NullaryClosure") {
    return resultValue(evaluate(target.body)(target.mod, target.env))
  }

  if (target.kind === "VariadicClosure") {
    return applyVariadicClosure(target, [])
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
  message += formatUnderTag(2, `target:`, prettyValue(width, target))
  throw new Error(message)
}
