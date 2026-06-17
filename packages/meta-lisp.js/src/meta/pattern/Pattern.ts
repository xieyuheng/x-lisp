import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import * as M from "../index.ts"

export function isPattern(exp: M.Exp): boolean {
  return isVarPattern(exp) || isDataPattern(exp)
}

// VarPattern

export function isVarPattern(exp: M.Exp): exp is M.VarExp {
  return exp.kind === "VarExp"
}

export function createVarPattern(name: string, location: S.SourceLocation) {
  return M.VarExp(name, location)
}

export function varPatternName(exp: M.Exp) {
  assert(isVarPattern(exp))
  assert(exp.kind === "VarExp")
  return exp.name
}

// DataPattern

export function isDataPattern(exp: M.Exp): exp is M.ApplyExp {
  if (exp.kind !== "ApplyExp") return false
  if (exp.target.kind !== "VarExp" && exp.target.kind !== "QualifiedVarExp")
    return false

  return exp.args.every((e) => isPattern(e))
}

export function createDataPattern(
  dataConstructor: M.DataConstructor,
  args: Array<M.Exp>,
  location: S.SourceLocation,
): M.Exp {
  return M.ApplyExp(M.VarExp(dataConstructor.name, location), args, location)
}

export function dataPatternArgPatterns(exp: M.Exp): Array<M.Exp> {
  assert(isDataPattern(exp))
  assert(exp.kind === "ApplyExp")
  return exp.args
}
