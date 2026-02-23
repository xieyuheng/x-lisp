import * as L from "../index.ts"

export function setupType(mod: L.Mod): void {
  for (const definition of L.modOwnDefinitions(mod)) {
    if (definition.kind === "TypeDefinition") {
      definition.value = L.evaluate(mod, L.emptyEnv(), definition.body)
    }
  }
}
