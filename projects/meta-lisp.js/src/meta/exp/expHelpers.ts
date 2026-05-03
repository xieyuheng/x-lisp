import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as Exps from "./index.ts"

export function BoolQualifiedVar(
  bool: boolean,
  location?: SourceLocation,
): Exps.QualifiedVar {
  return Exps.QualifiedVar("builtin", bool ? "true" : "false", location)
}
