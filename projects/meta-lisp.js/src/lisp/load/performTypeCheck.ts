import * as L from "../index.ts"

export function performTypeCheck(mod: L.Mod): void {
  for (const definition of L.modOwnDefinitions(mod)) {
    L.definitionCheck(definition)
  }
}
