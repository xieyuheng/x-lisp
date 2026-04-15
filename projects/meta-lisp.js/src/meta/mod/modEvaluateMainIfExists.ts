import * as M from "../index.ts"
import assert from "node:assert"

export function modEvaluateMainIfExists(mod: M.Mod): void {
  const main = M.modLookupDefinition(mod, "main")
  if (main) {
    assert(main.kind === "FunctionDefinition")
    M.evaluate(mod, M.emptyEnv(), main.body)
  }
}
