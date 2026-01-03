import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import type { Atom } from "../../lisp/index.ts"

export type Exp = Atom | Sequence

export type Sequence=  {
  kind: "Sequence"
}
