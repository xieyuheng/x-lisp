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
