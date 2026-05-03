import { setUnionMany } from "@xieyuheng/helpers.js/set"
import assert from "node:assert"
import * as M from "../index.ts"

export function isPattern(exp: M.Exp): boolean {
  return isVarPattern(exp) || isDataPattern(exp)
}

// VarPattern

export function isVarPattern(exp: M.Exp): boolean {
  return exp.kind === "Var"
}

export function createVarPattern(name: string) {
  return M.Var(name)
}

export function varPatternName(exp: M.Exp) {
  assert(isVarPattern(exp))
  assert(exp.kind === "Var")
  return exp.name
}

// DataPattern

export function isDataPattern(exp: M.Exp): boolean {
  if (exp.kind === "Apply" && exp.target.kind === "Var") {
    return exp.args.every((e) => isPattern(e))
  }

  return false
}

export function createDataPattern(
  dataConstructor: M.DataConstructor,
  args: Array<M.Exp>,
): M.Exp {
  return M.Apply(M.Var(dataConstructor.name), args)
}

export function dataPatternDataConstructor(
  mod: M.Mod,
  exp: M.Exp,
): M.DataConstructor {
  if (exp.kind === "Apply" && exp.target.kind === "Var") {
    const dataConstructor = M.modLookupDataConstructor(mod, exp.target.name)
    assert(dataConstructor)
    return dataConstructor
  }

  throw new Error("[dataPatternDataConstructor] unhandled exp")
}

export function dataPatternArgPatterns(exp: M.Exp): Array<M.Exp> {
  if (exp.kind === "Apply" && exp.target.kind === "Var") {
    return exp.args
  }

  throw new Error("[dataPatternArgPatterns] unhandled exp")
}

// boundNames

export function patternBoundNames(pattern: M.Exp): Set<string> {
  if (isVarPattern(pattern)) {
    return new Set(varPatternName(pattern))
  }

  if (isDataPattern(pattern)) {
    return setUnionMany(dataPatternArgPatterns(pattern).map(patternBoundNames))
  }

  throw new Error("[patternBoundNames] unhandled exp")
}
