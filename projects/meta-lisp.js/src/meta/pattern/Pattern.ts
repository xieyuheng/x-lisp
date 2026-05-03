import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
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
  if (exp.kind !== "Apply") return false
  if (exp.target.kind !== "Var" && exp.target.kind !== "QualifiedVar")
    return false

  return exp.args.every((e) => isPattern(e))
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
  assert(isDataPattern(exp))
  assert(exp.kind === "Apply")

  if (exp.target.kind === "Var") {
    const dataConstructor = M.modLookupDataConstructor(mod, exp.target.name)
    if (!dataConstructor) {
      let message = `[dataPatternDataConstructor] undefined target name`
      message += `\n  exp: ${M.formatExp(exp)}`
      if (exp.location)
        throw new S.ErrorWithSourceLocation(message, exp.location)
      else throw new Error(message)
    }

    return dataConstructor
  }

  if (exp.target.kind === "QualifiedVar") {
    const qualifiedMod = M.projectLookupMod(mod.project, exp.target.modName)
    assert(qualifiedMod)
    const dataConstructor = M.modLookupDataConstructor(
      qualifiedMod,
      exp.target.name,
    )
    if (!dataConstructor) {
      let message = `[dataPatternDataConstructor] undefined target name`
      message += `\n  exp: ${M.formatExp(exp)}`
      if (exp.location)
        throw new S.ErrorWithSourceLocation(message, exp.location)
      else throw new Error(message)
    }

    return dataConstructor
  }

  throw new Error("[dataPatternDataConstructor] unhandled exp")
}

export function dataPatternArgPatterns(exp: M.Exp): Array<M.Exp> {
  assert(isDataPattern(exp))
  assert(exp.kind === "Apply")
  return exp.args
}

// boundNames

export function patternBoundNames(pattern: M.Exp): Set<string> {
  if (isVarPattern(pattern)) {
    return new Set([varPatternName(pattern)])
  }

  if (isDataPattern(pattern)) {
    return setUnionMany(dataPatternArgPatterns(pattern).map(patternBoundNames))
  }

  throw new Error("[patternBoundNames] unhandled exp")
}
