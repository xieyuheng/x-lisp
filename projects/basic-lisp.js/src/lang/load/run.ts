import assert from "node:assert"
import { call, createContext } from "../execute/index.ts"
import { modLookupDefinition, type Mod } from "../mod/index.ts"

export function run(mod: Mod): void {
  const context = createContext(mod)
  const definition = modLookupDefinition(context.mod, "main")
  assert(definition)
  call(context, definition, [])
}
