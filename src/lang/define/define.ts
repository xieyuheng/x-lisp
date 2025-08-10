import { formatValue } from "../format/index.ts"
import { modLookup, type Mod } from "../mod/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"

export function define(mod: Mod, name: string, value: Value): void {
  const found = modLookup(mod, name)
  if (found) {
    let message = `[define] I can not redefine name: ${name}\n`
    message += `  new value: ${formatValue(value)}\n`
    message += `  old value: ${formatValue(found)}\n`
    throw new Error(message)
  }

  const definition = { origin: mod, name, value }
  mod.defined.set(name, definition)

  const claimedDefinition = mod.claimed.get(name)
  if (claimedDefinition) {
    definition.value = Values.Claimed(definition.value, claimedDefinition.value)
  }
}
