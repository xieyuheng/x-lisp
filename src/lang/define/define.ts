import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import type { Value } from "../value/index.ts"

export function define(mod: Mod, name: string, value: Value): void {
  if (mod.defs.get(name)) {
    let message = `[define] I can not redefine name: ${name}\n`
    message += `  to value: ${formatValue(value)}\n`
    throw new Error(message)
  }

  mod.defs.set(name, { mod, name, value })

  if (value.kind === "Lambda" && value.definedName === undefined) {
    value.definedName = name
  }
}
