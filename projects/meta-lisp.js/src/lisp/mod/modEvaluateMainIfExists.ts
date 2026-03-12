import assert from "node:assert"
import * as L from "../index.ts"

export function modEvaluateMainIfExists(mod: L.Mod): void {
  const main = L.modLookupDefinition(mod, "main")
  if (main) {
    assert(main.kind === "FunctionDefinition")
    L.evaluate(mod, L.emptyEnv(), main.body)
  }
}
