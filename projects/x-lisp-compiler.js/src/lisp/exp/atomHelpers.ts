import type { Atom } from "./Atom.ts"

export function isAtom(exp: any): exp is Atom {
  return (
    "kind" in exp &&
    (exp.kind === "Hashtag" ||
      exp.kind === "Symbol" ||
      exp.kind === "String" ||
      exp.kind === "Int" ||
      exp.kind === "Float")
  )
}
