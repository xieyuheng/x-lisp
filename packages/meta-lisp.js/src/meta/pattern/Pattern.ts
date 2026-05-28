import { setUnionMany } from "@xieyuheng/helpers.js/set"
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

export function dataPatternDataConstructor(
  mod: M.Mod,
  exp: M.Exp,
): M.DataConstructor {
  assert(isDataPattern(exp))
  assert(exp.kind === "ApplyExp")

  if (exp.target.kind === "VarExp") {
    const dataConstructor = M.modLookupDataConstructor(mod, exp.target.name)
    if (!dataConstructor) {
      let message = `[dataPatternDataConstructor] undefined target name`
      message += `\n  exp: ${M.formatExp(exp)}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }

    return dataConstructor
  }

  if (exp.target.kind === "QualifiedVarExp") {
    const qualifiedMod = M.packageLookupMod(mod.pkg, exp.target.modName)
    assert(qualifiedMod)
    const dataConstructor = M.modLookupDataConstructor(
      qualifiedMod,
      exp.target.name,
    )
    if (!dataConstructor) {
      let message = `[dataPatternDataConstructor] undefined target name`
      message += `\n  exp: ${M.formatExp(exp)}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }

    return dataConstructor
  }

  throw new Error("[dataPatternDataConstructor] unhandled exp")
}

export function dataPatternArgPatterns(exp: M.Exp): Array<M.Exp> {
  assert(isDataPattern(exp))
  assert(exp.kind === "ApplyExp")
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
