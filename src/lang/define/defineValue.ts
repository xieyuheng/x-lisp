import { ValueDefinition } from "../definition/index.ts"
import { formatValue } from "../format/index.ts"
import { modLookupDefinition, type Mod } from "../mod/index.ts"
import { type Value } from "../value/index.ts"

export function defineValue(mod: Mod, name: string, value: Value): void {
  const found = modLookupDefinition(mod, name)
  if (found) {
    let message = `[defineValue] can not redefine name: ${name}\n`
    message += `  new value: ${formatValue(value)}\n`
    throw new Error(message)
  }

  const definition = ValueDefinition(mod, name, value)
  definition.schema = mod.claimed.get(name)
  mod.defined.set(name, definition)
}
