import * as L from "../index.ts"

export function definitionToDataConstructor(
  definition: L.Definition,
): L.DataConstructor | undefined {
  for (const ownDefinition of L.modOwnDefinitions(definition.mod)) {
    if (ownDefinition.kind === "DatatypeDefinition") {
      for (const dataConstructor of ownDefinition.dataConstructors) {
        if (dataConstructor.name === definition.name) {
          return dataConstructor
        }
      }
    }
  }

  return undefined
}

export function definitionToDatatypeDefinition(
  definition: L.Definition,
): L.DatatypeDefinition | undefined {
  for (const ownDefinition of L.modOwnDefinitions(definition.mod)) {
    if (ownDefinition.kind === "DatatypeDefinition") {
      for (const dataConstructor of ownDefinition.dataConstructors) {
        if (dataConstructor.name === definition.name) {
          return ownDefinition
        }
      }
    }
  }

  return undefined
}

export function definitionIsDataConstructor(definition: L.Definition): boolean {
  return Boolean(definitionToDataConstructor(definition))
}
