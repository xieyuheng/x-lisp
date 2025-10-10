import { indent } from "../../utils/format/indent.ts"
import { urlRelativeToCwd } from "../../utils/url/urlRelativeToCwd.ts"
import { formatDefinition } from "../definition/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Value } from "../value/index.ts"

export function claim(mod: Mod, name: string, schema: Value): void {
  const found = mod.claimed.get(name)
  if (found) {
    let message = `[claim] can not reclaim name`
    message += `\n  mod: ${urlRelativeToCwd(mod.url)}`
    message += `\n  name: ${name}`
    message += `\n  old schema: ${formatValue(found)}`
    message += `\n  new schema: ${formatValue(schema)}`
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
    message += `\n  schema: ${formatValue(schema)}`
    message += `\n  definition:`
    message += indent(formatDefinition(definition), { length: 4 })
    throw new Error(message)
  }
}
