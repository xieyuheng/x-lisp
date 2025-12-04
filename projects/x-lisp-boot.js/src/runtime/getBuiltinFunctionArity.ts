import * as B from "../basic/index.ts"

export function getBuiltinFunctionArity(name: string): number | undefined {
  const definition = B.modLookupDefinition(B.useBuiltinMod(), name)
  if (!definition) {
    return undefined
  }

  return B.definitionArity(definition)
}

export function hasBuiltinFunction(name: string): Boolean {
  const definition = B.modLookupDefinition(B.useBuiltinMod(), name)
  return definition !== undefined
}
