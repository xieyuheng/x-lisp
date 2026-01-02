import { formatIndent, formatUnderTag } from "@xieyuheng/helpers.js/format"
import { globals } from "../../globals.ts"
import { ValueDefinition } from "../definition/index.ts"
import { formatDefinition } from "../format/index.ts"
import { modLookupDefinition, type Mod } from "../mod/index.ts"
import { prettyValue } from "../pretty/index.ts"
import { type Value } from "../value/index.ts"

export function define(mod: Mod, name: string, value: Value): void {
  const maxWidth = globals.maxWidth
  const found = modLookupDefinition(mod, name)
  if (found) {
    let message = `[define] can not redefine name: ${name}`
    message += formatUnderTag(2, `new value:`, prettyValue(maxWidth, value))
    message += `\n  old definition:`
    message += formatIndent(4, formatDefinition(found))
    throw new Error(message)
  }

  const definition = ValueDefinition(mod, name, value)
  definition.schema = mod.claimed.get(name)
  mod.definitions.set(name, definition)
}
