import { validateOrFail } from "../evaluate/index.ts"
import { formatValue } from "../format/index.ts"
import { modLookupValue, type Mod } from "../mod/index.ts"
import { type Value } from "../value/index.ts"

export function define(mod: Mod, name: string, value: Value): void {
  const found = modLookupValue(mod, name)
  if (found) {
    let message = `[define] I can not redefine name: ${name}\n`
    message += `  old value: ${formatValue(found)}\n`
    message += `  new value: ${formatValue(value)}\n`
    throw new Error(message)
  }

  const defined = { origin: mod, name, value }
  mod.defined.set(name, defined)

  const claimed = mod.claimed.get(name)
  if (claimed) {
    defined.value = validateOrFail(claimed.value, defined.value)
  }
}
