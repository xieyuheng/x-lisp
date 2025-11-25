import assert from "node:assert"
import { callDefinition, createContext } from "../execute/index.ts"
import { modLookupDefinition, type Mod } from "../mod/index.ts"

export function run(mod: Mod): void {
  const context = createContext(mod)
  const definition = modLookupDefinition(context.mod, "main")
  assert(definition)
  callDefinition(context, definition, [])
}
