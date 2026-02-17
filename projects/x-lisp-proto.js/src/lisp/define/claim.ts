import { formatIndent, formatUnderTag } from "@xieyuheng/helpers.js/format"
import { urlRelativeToCwd } from "@xieyuheng/helpers.js/url"
import { textWidth } from "../../config.ts"
import { formatDefinition } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import { prettyValue } from "../pretty/index.ts"
import { type Value } from "../value/index.ts"

export function claim(mod: Mod, name: string, schema: Value): void {
  const width = textWidth
  const found = mod.claimed.get(name)
  if (found) {
    let message = `[claim] can not reclaim name`
    message += `\n  mod: ${urlRelativeToCwd(mod.url)}`
    message += `\n  name: ${name}`
    message += formatUnderTag(2, `old schema:`, prettyValue(width, found))
    message += formatUnderTag(2, `new schema:`, prettyValue(width, schema))
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
    message += formatUnderTag(2, `schema:`, prettyValue(width, schema))
    message += `\n  definition:`
    message += formatIndent(4, formatDefinition(definition))
    throw new Error(message)
  }
}
