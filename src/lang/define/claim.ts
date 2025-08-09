import { formatValue } from "../format/index.ts"
import { modGetValue, type Mod } from "../mod/index.ts"
import type { Value } from "../value/index.ts"

export function claim(mod: Mod, name: string, value: Value): void {
  const found = mod.claims.get(name)
  if (found) {
    let message = `[claim] I can not reclaim name: ${name}\n`
    message += `  new value: ${formatValue(value)}\n`
    message += `  old value: ${formatValue(found)}\n`
    throw new Error(message)
  }

  mod.claims.set(name, value)

  const definedValue = modGetValue(mod, name)
  if (definedValue && definedValue.kind === "Lambda") {
    definedValue.claims.push(value)
  }
}
