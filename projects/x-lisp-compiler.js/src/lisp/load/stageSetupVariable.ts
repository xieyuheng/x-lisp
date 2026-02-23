import * as L from "../index.ts"

export function stageSetupVariable(mod: L.Mod): void {
  for (const definition of L.modOwnDefinitions(mod)) {
    if (definition.kind === "VariableDefinition") {
      definition.value = L.evaluate(mod, L.emptyEnv(), definition.body)
    }

    if (definition.kind === "TypeDefinition") {
      definition.value = L.evaluate(mod, L.emptyEnv(), definition.body)
    }
  }
}
