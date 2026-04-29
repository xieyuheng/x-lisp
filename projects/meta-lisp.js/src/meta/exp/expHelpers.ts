import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as Exps from "./index.ts"

export function VoidVar(location?: SourceLocation): Exps.Var {
  return Exps.Var("void", location)
}

export function BoolVar(bool: boolean, location?: SourceLocation): Exps.Var {
  return Exps.Var(bool ? "true" : "false", location)
}
