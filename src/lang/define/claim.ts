import { globals } from "../../globals.ts"
import { formatIndent } from "../../helper/format/formatIndent.ts"
import { formatUnderTag } from "../../helper/format/formatUnderTag.ts"
import { urlRelativeToCwd } from "../../helper/url/urlRelativeToCwd.ts"
import { formatDefinition } from "../definition/index.ts"
import { type Mod } from "../mod/index.ts"
import { prettyValue } from "../pretty/index.ts"
import { type Value } from "../value/index.ts"

export function claim(mod: Mod, name: string, schema: Value): void {
  const maxWidth = globals.maxWidth
  const found = mod.claimed.get(name)
  if (found) {
    let message = `[claim] can not reclaim name`
    message += `\n  mod: ${urlRelativeToCwd(mod.url)}`
    message += `\n  name: ${name}`
    message += formatUnderTag(2, `old schema:`, prettyValue(maxWidth, found))
    message += formatUnderTag(2, `new schema:`, prettyValue(maxWidth, schema))
    throw new Error(message)
  }

  mod.claimed.set(name, schema)

  const definition = mod.defined.get(name)

  if (definition && definition.origin === mod) {
    definition.schema = schema
  }

  if (definition && definition.origin !== mod) {
    let message = `[claim] can not claim name of other module`
    message += `\n  mod: ${urlRelativeToCwd(mod.url)}`
    message += `\n  name: ${name}`
    message += formatUnderTag(2, `schema:`, prettyValue(maxWidth, schema))
    message += `\n  definition:`
    message += formatIndent(4, formatDefinition(definition))
    throw new Error(message)
  }
}
