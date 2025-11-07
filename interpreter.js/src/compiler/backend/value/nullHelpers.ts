import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function Null(): Values.Hashtag {
  return {
    kind: "Hashtag",
    content: "null",
  }
}

export function isNull(value: Value): boolean {
  return value.kind === "Hashtag" && value.content === "null"
}
