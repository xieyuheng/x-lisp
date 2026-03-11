import * as L from "../index.ts"

export function definitionIsDataConstructor(definition: L.Definition): boolean {
  for (const ownDefinition of L.modOwnDefinitions(definition.mod)) {
    if (ownDefinition.kind === "DatatypeDefinition") {
      for (const dataConstructor of ownDefinition.dataConstructors) {
        if (dataConstructor.name === definition.name) {
          return true
        }
      }
    }
  }

  return false
}
