import { formatValue } from "../format/index.ts"
import { modGetValue, type Mod } from "../mod/index.ts"
import type { Value } from "../value/index.ts"

export function define(mod: Mod, name: string, value: Value): void {
  const found = modGetValue(mod, name)
  if (found) {
    let message = `[define] I can not redefine name: ${name}\n`
    message += `  new value: ${formatValue(value)}\n`
    message += `  old value: ${formatValue(found)}\n`
    throw new Error(message)
  }

  mod.defs.set(name, { mod, name, value })

  if (value.kind === "Lambda" && value.definedName === undefined) {
    value.definedName = name

    const claimedValue = mod.claims.get(name)
    if (claimedValue) {
      value.claims.push(claimedValue)
    }
  }
}
