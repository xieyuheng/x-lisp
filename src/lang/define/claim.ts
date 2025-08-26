import { validate } from "../evaluate/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Value } from "../value/index.ts"

export function claim(mod: Mod, name: string, schema: Value): void {
  const found = mod.claimed.get(name)
  if (found) {
    let message = `[claim] I can not reclaim name: ${name}\n`
    message += `  new schema: ${formatValue(schema)}\n`
    message += `  old schema: ${formatValue(found.value)}\n`
    throw new Error(message)
  }

  mod.claimed.set(name, { origin: mod, name, value: schema })

  const defined = mod.defined.get(name)
  if (defined) {
    defined.value = validate(schema, defined.value)
  }
}
