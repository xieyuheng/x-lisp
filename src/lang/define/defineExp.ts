import { LazyDefinition } from "../definition/Definition.ts"
import type { Exp } from "../exp/Exp.ts"
import { formatExp } from "../format/formatExp.ts"
import { type Mod, modLookupDefinition } from "../mod/Mod.ts"

export function defineExp(mod: Mod, name: string, exp: Exp): void {
  const found = modLookupDefinition(mod, name)
  if (found) {
    let message = `[defineExp] can not redefine name: ${name}\n`
    message += `  new exp: ${formatExp(exp)}\n`
    throw new Error(message)
  }

  const definition = LazyDefinition(mod, name, exp)
  definition.schema = mod.claimed.get(name)
  mod.defined.set(name, definition)
}
