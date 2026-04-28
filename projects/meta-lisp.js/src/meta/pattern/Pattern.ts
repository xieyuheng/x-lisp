import assert from "node:assert"
import * as M from "../index.ts"

export function isPattern(mod: M.Mod, exp: M.Exp): boolean {
  return isVarPattern(mod, exp) || isDataPattern(mod, exp)
}

// VarPattern

export function isVarPattern(mod: M.Mod, exp: M.Exp): boolean {
  if (exp.kind === "Var") {
    return !isDataConstructorName(mod, exp.name)
  }

  return false
}

function isDataConstructorName(mod: M.Mod, name: string): boolean {
  const definition = M.modLookupDefinition(mod, name)
  if (definition) {
    return M.definitionIsDataConstructor(definition)
  }

  const builtinMod = M.loadBuiltinMod(mod.project)
  const builtinDefinition = M.modLookupDefinition(builtinMod, name)
  if (builtinDefinition) {
    return M.definitionIsDataConstructor(builtinDefinition)
  }

  return false
}

export function createVarPattern(mod: M.Mod, name: string) {
  assert(!isDataConstructorName(mod, name))
  return M.Var(name)
}

export function varPatternName(mod: M.Mod, exp: M.Exp) {
  assert(isVarPattern(mod, exp))
  assert(exp.kind === "Var")
  return exp.name
}

// DataPattern

export function isDataPattern(mod: M.Mod, exp: M.Exp): boolean {
  if (exp.kind === "Var") {
    return isDataConstructorName(mod, exp.name)
  }

  if (exp.kind === "Apply" && exp.target.kind === "Var") {
    return (
      isDataConstructorName(mod, exp.target.name) &&
      exp.args.every((e) => isPattern(mod, e))
    )
  }

  return false
}

export function createDataPattern(
  mod: M.Mod,
  dataConstructor: M.DataConstructor,
  args: Array<M.Exp>,
): M.Exp {
  assert(isDataConstructorName(mod, dataConstructor.name))
  return M.Apply(M.Var(dataConstructor.name), args)
}

export function dataPatternDataConstructor(
  mod: M.Mod,
  exp: M.Exp,
): M.DataConstructor {
  assert(isDataPattern(mod, exp))

  if (exp.kind === "Var") {
    const dataConstructor = M.modLookupDataConstructor(mod, exp.name)
    assert(dataConstructor)
    return dataConstructor
  }

  if (exp.kind === "Apply" && exp.target.kind === "Var") {
    const dataConstructor = M.modLookupDataConstructor(mod, exp.target.name)
    assert(dataConstructor)
    return dataConstructor
  }

  throw new Error("[dataPatternDataConstructor] unhandled exp")
}

export function dataPatternArgPatterns(mod: M.Mod, exp: M.Exp): Array<M.Exp> {
  assert(isDataPattern(mod, exp))

  if (exp.kind === "Var") {
    return []
  }

  if (exp.kind === "Apply" && exp.target.kind === "Var") {
    return exp.args
  }

  throw new Error("[dataPatternArgPatterns] unhandled exp")
}
