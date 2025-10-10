import { ErrorWithMeta } from "@xieyuheng/x-data.js"
import { indent } from "../../utils/format/indent.ts"
import { LazyDefinition } from "../definition/Definition.ts"
import { formatDefinition } from "../definition/formatDefinition.ts"
import type { Exp } from "../exp/Exp.ts"
import { formatExp } from "../format/formatExp.ts"
import { type Mod, modLookupDefinition } from "../mod/Mod.ts"

export function defineLazy(mod: Mod, name: string, exp: Exp): void {
  const found = modLookupDefinition(mod, name)
  if (found) {
    let message = `[defineLazy] can not redefine name: ${name}`
    message += `\n  new exp: ${formatExp(exp)}`
    message += `\n  old definition:`
    message += indent(4, formatDefinition(found))
    throw new ErrorWithMeta(message, exp.meta)
  }

  const definition = LazyDefinition(mod, name, exp)
  definition.schema = mod.claimed.get(name)
  mod.defined.set(name, definition)
}
