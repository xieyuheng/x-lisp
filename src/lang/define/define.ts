import { formatValue } from "../format/index.ts"
import { modGetValue, type Mod } from "../mod/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"

export function define(mod: Mod, name: string, value: Value): void {
  const found = modGetValue(mod, name)
  if (found) {
    let message = `[define] I can not redefine name: ${name}\n`
    message += `  new value: ${formatValue(value)}\n`
    message += `  old value: ${formatValue(found)}\n`
    throw new Error(message)
  }

  const definition = { mod, name, value }
  mod.definitions.set(name, definition)

  const schema = mod.claims.get(name)
  if (schema) {
    definition.value = Values.Claimed(definition.value, schema)
  }
}
