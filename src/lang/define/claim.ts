import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"

export function claim(mod: Mod, name: string, schema: Value): void {
  const found = mod.claims.get(name)
  if (found) {
    let message = `[claim] I can not reclaim name: ${name}\n`
    message += `  new schema: ${formatValue(schema)}\n`
    message += `  old schema: ${formatValue(found)}\n`
    throw new Error(message)
  }

  mod.claims.set(name, schema)

  const definition = mod.definitions.get(name)
  if (definition) {
    definition.value = Values.Claimed(definition.value, schema)
  }
}
