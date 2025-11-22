import * as S from "@xieyuheng/sexp.js"
import type { Exp } from "../exp/index.ts"
import { formatExp } from "../format/index.ts"

export function varName(exp: Exp): string {
  if (exp.kind === "Var") {
    return exp.name
  }

  let message = `[varName] exp is not Var`
  message += `\n  exp: ${formatExp(exp)}`
  if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
  else throw new Error(message)
}
