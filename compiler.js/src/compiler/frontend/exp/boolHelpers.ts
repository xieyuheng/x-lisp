import { formatExp } from "../format/index.ts"
import * as Exps from "./index.ts"
import { type Exp } from "./index.ts"

export function Bool(bool: boolean): Exps.Hashtag {
  return {
    kind: "Hashtag",
    content: bool ? "t" : "f",
  }
}

export function isBool(exp: Exp): boolean {
  return isTrue(exp) || isFalse(exp)
}

export function isTrue(exp: Exp): boolean {
  return exp.kind === "Hashtag" && exp.content === "t"
}

export function isFalse(exp: Exp): boolean {
  return exp.kind === "Hashtag" && exp.content === "f"
}

export function asBool(exp: Exp): Exps.Hashtag {
  if (isBool(exp)) return exp as Exps.Hashtag
  throw new Error(`[asBool] fail on: ${formatExp(exp)}`)
}
