import { LazyDefinition, ValueDefinition } from "../definition/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatExp, formatValue } from "../format/index.ts"
import { modLookupDefinition, type Mod } from "../mod/index.ts"
import { type Value } from "../value/index.ts"

export function defineValue(mod: Mod, name: string, value: Value): void {
  const found = modLookupDefinition(mod, name)
  if (found) {
    let message = `[defineValue] I can not redefine name: ${name}\n`
    message += `  new value: ${formatValue(value)}\n`
    throw new Error(message)
  }

  const definition = ValueDefinition(mod, name, value)
  definition.schema = mod.claimed.get(name)
  mod.defined.set(name, definition)
}

export function defineExp(mod: Mod, name: string, exp: Exp): void {
  const found = modLookupDefinition(mod, name)
  if (found) {
    let message = `[defineExp] I can not redefine name: ${name}\n`
    message += `  new exp: ${formatExp(exp)}\n`
    throw new Error(message)
  }

  const definition = LazyDefinition(mod, name, exp)
  definition.schema = mod.claimed.get(name)
  mod.defined.set(name, definition)
}
