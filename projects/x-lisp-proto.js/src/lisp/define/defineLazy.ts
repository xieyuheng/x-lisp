import { formatIndent, formatUnderTag } from "@xieyuheng/helpers.js/format"
import { ErrorWithMeta } from "@xieyuheng/sexp.js"
import { globals } from "../../globals.ts"
import { LazyDefinition } from "../definition/Definition.ts"
import { type Exp } from "../exp/Exp.ts"
import { formatDefinition } from "../format/index.ts"
import { type Mod, modLookupDefinition } from "../mod/Mod.ts"
import { prettyExp } from "../pretty/index.ts"

export function defineLazy(mod: Mod, name: string, exp: Exp): void {
  const maxWidth = globals.maxWidth
  const found = modLookupDefinition(mod, name)
  if (found) {
    let message = `[defineLazy] can not redefine name: ${name}`
    message += formatUnderTag(2, `new exp:`, prettyExp(maxWidth, exp))
    message += `\n  old definition:`
    message += formatIndent(4, formatDefinition(found))
    throw new ErrorWithMeta(message, exp.meta)
  }

  const definition = LazyDefinition(mod, name, exp)
  definition.schema = mod.claimed.get(name)
  mod.definitions.set(name, definition)
}
