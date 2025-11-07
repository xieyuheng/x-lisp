import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function Bool(bool: boolean): Values.Hashtag {
  return {
    kind: "Hashtag",
    content: bool ? "t" : "f",
  }
}

export function isBool(value: Value): boolean {
  return isTrue(value) || isFalse(value)
}

export function isTrue(value: Value): boolean {
  return value.kind === "Hashtag" && value.content === "t"
}

export function isFalse(value: Value): boolean {
  return value.kind === "Hashtag" && value.content === "f"
}

export function asBool(value: Value): Values.Hashtag {
  if (isBool(value)) return value as Values.Hashtag
  throw new Error(`[asBool] fail on: ${formatValue(value)}`)
}
