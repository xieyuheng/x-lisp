import { the } from "../evaluate/index.ts"
import { formatValue } from "../format/index.ts"
import { modLookupValue, type Mod } from "../mod/index.ts"
import type { Value } from "../value/index.ts"

export type DefineOptions = { isPrivate?: boolean }

export function define(
  mod: Mod,
  name: string,
  value: Value,
  options: DefineOptions = {},
): void {
  const found = modLookupValue(mod, name)
  if (found) {
    let message = `[define] I can not redefine name: ${name}\n`
    message += `  new value: ${formatValue(value)}\n`
    message += `  old value: ${formatValue(found)}\n`
    throw new Error(message)
  }

  const { isPrivate } = options

  const defined = { origin: mod, name, value, isPrivate }
  mod.defined.set(name, defined)

  const claimed = mod.claimed.get(name)
  if (claimed) {
    defined.value = the(claimed.value, defined.value)
  }
}
