import { indent } from "../../utils/format/indent.ts"
import { formatDefinition, ValueDefinition } from "../definition/index.ts"
import { formatValue } from "../format/index.ts"
import { modLookupDefinition, type Mod } from "../mod/index.ts"
import { type Value } from "../value/index.ts"

export function define(mod: Mod, name: string, value: Value): void {
  const found = modLookupDefinition(mod, name)
  if (found) {
    let message = `[define] can not redefine name: ${name}`
    message += `\n  new value: ${formatValue(value)}`
    message += `\n  old definition:`
    message += indent(formatDefinition(found), { length: 4 })
    throw new Error(message)
  }

  const definition = ValueDefinition(mod, name, value)
  definition.schema = mod.claimed.get(name)
  mod.defined.set(name, definition)
}
