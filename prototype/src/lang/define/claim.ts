import { globals } from "../../globals.ts"
import { formatIndent } from "../../helpers/format/formatIndent.ts"
import { formatUnderTag } from "../../helpers/format/formatUnderTag.ts"
import { urlRelativeToCwd } from "../../helpers/url/urlRelativeToCwd.ts"
import { formatDefinition } from "../format/index.ts"
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

  const definition = mod.definitions.get(name)

  if (definition && definition.mod === mod) {
    definition.schema = schema
  }

  if (definition && definition.mod !== mod) {
    let message = `[claim] can not claim name of other module`
    message += `\n  mod: ${urlRelativeToCwd(mod.url)}`
    message += `\n  name: ${name}`
    message += formatUnderTag(2, `schema:`, prettyValue(maxWidth, schema))
    message += `\n  definition:`
    message += formatIndent(4, formatDefinition(definition))
    throw new Error(message)
  }
}
