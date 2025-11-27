import { call, createContext } from "../execute/index.ts"
import {
  modLookupDefinition,
  modOwnDefinitions,
  type Mod,
} from "../mod/index.ts"

export function run(mod: Mod): void {
  for (const definition of modOwnDefinitions(mod)) {
    if (definition.kind === "SetupDefinition") {
      const context = createContext(mod)
      call(context, definition, [])
    }
  }

  const definition = modLookupDefinition(mod, "_main")
  if (definition !== undefined) {
    const context = createContext(mod)
    call(context, definition, [])
  }
}
