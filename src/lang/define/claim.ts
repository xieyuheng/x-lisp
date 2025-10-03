import { indent } from "../../utils/format/indent.ts"
import { urlRelativeToCwd } from "../../utils/url/urlRelativeToCwd.ts"
import { formatDefinition } from "../definition/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Value } from "../value/index.ts"

export function claim(mod: Mod, name: string, schema: Value): void {
  const found = mod.claimed.get(name)
  if (found) {
    let message = `[claim] can not reclaim name\n`
    message += `  mod: ${urlRelativeToCwd(mod.url)}\n`
    message += `  name: ${name}\n`
    message += `  old schema: ${formatValue(found)}\n`
    message += `  new schema: ${formatValue(schema)}\n`
    throw new Error(message)
  }

  mod.claimed.set(name, schema)

  const definition = mod.defined.get(name)

  if (definition && definition.origin === mod) {
    definition.schema = schema
  }

  if (definition && definition.origin !== mod) {
    let message = `[claim] can not claim name of other module\n`
    message += `  mod: ${urlRelativeToCwd(mod.url)}\n`
    message += `  name: ${name}\n`
    message += `  schema: ${formatValue(schema)}\n`
    message += `  definition:\n`
    message += indent(formatDefinition(definition), { length: 4 })
    throw new Error(message)
  }
}
