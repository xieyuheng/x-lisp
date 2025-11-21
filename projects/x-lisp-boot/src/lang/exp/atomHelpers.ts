import type { Atom } from "./Atom.ts"
import type { Exp } from "./Exp.ts"

export function isAtom(exp: Exp): exp is Atom {
  return (
    exp.kind === "Hashtag" ||
    exp.kind === "Symbol" ||
    exp.kind === "String" ||
    exp.kind === "Int" ||
    exp.kind === "Float"
  )
}
