import * as L from "../index.ts"

export function definitionToDataConstructor(
  definition: L.Definition,
): L.DataConstructor | undefined {
  return definition.mod.dataConstructors.get(definition.name)
}

export function definitionIsDataConstructor(definition: L.Definition): boolean {
  return Boolean(definitionToDataConstructor(definition))
}
