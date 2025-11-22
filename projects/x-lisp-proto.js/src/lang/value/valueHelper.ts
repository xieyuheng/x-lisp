import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Value } from "./Value.ts"

export function valueMaybeMeta(value: Value): Meta | undefined {
  switch (value.kind) {
    case "Closure":
    case "NullaryClosure": {
      return value.meta
    }

    default: {
      return undefined
    }
  }
}
