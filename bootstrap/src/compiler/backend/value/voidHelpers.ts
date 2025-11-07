import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function Void(): Values.Hashtag {
  return {
    kind: "Hashtag",
    content: "void",
  }
}

export function isVoid(value: Value): boolean {
  return value.kind === "Hashtag" && value.content === "void"
}
