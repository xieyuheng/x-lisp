import assert from "node:assert"
import * as L from "../index.ts"

export function isPattern(mod: L.Mod, exp: L.Exp): boolean {
  return isVarPattern(mod, exp) || isDataPattern(mod, exp)
}

// VarPattern

export function isVarPattern(mod: L.Mod, exp: L.Exp): boolean {
  if (exp.kind === "Var") {
    return !isDataConstructorName(mod, exp.name)
  }

  return false
}

function isDataConstructorName(mod: L.Mod, name: string): boolean {
  const definition = L.modLookupDefinition(mod, name)
  return definition !== undefined && L.definitionIsDataConstructor(definition)
}

function findDataConstructor(
  mod: L.Mod,
  name: string,
): L.DataConstructor | undefined {
  const definition = L.modLookupDefinition(mod, name)
  return definition && L.definitionToDataConstructor(definition)
}

export function createVarPattern(mod: L.Mod, name: string) {
  assert(!isDataConstructorName(mod, name))
  return L.Var(name)
}

export function varPatternName(mod: L.Mod, exp: L.Exp) {
  assert(isVarPattern(mod, exp))
  assert(exp.kind === "Var")
  return exp.name
}

// DataPattern

export function isDataPattern(mod: L.Mod, exp: L.Exp): boolean {
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
  mod: L.Mod,
  dataConstructor: L.DataConstructor,
  args: Array<L.Exp>,
): L.Exp {
  assert(isDataConstructorName(mod, dataConstructor.name))
  return L.Apply(L.Var(dataConstructor.name), args)
}

export function dataPatternDataConstructor(
  mod: L.Mod,
  exp: L.Exp,
): L.DataConstructor {
  assert(isDataPattern(mod, exp))

  if (exp.kind === "Var") {
    const dataConstructor = findDataConstructor(mod, exp.name)
    assert(dataConstructor)
    return dataConstructor
  }

  if (exp.kind === "Apply" && exp.target.kind === "Var") {
    const dataConstructor = findDataConstructor(mod, exp.target.name)
    assert(dataConstructor)
    return dataConstructor
  }

  throw new Error("[dataPatternDataConstructor] unhandled exp")
}

export function dataPatternArgPatterns(mod: L.Mod, exp: L.Exp): Array<L.Exp> {
  assert(isDataPattern(mod, exp))

  if (exp.kind === "Var") {
    return []
  }

  if (exp.kind === "Apply" && exp.target.kind === "Var") {
    return exp.args
  }

  throw new Error("[dataPatternArgPatterns] unhandled exp")
}
