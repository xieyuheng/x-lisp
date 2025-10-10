import { urlRelativeToCwd } from "../../utils/url/urlRelativeToCwd.ts"
import { formatExp, formatValue } from "../format/index.ts"
import type { Definition } from "./index.ts"

export function formatDefinition(definition: Definition): string {
  switch (definition.kind) {
    case "ValueDefinition": {
      let message = ""
      message += `\norigin: ${urlRelativeToCwd(definition.origin.url)}`
      message += `\nname: ${definition.name}`
      message += `\nvalue: ${formatValue(definition.value)}`
      if (definition.schema)
        message += `\nschema: ${formatValue(definition.schema)}`
      if (definition.validatedValue)
        message += `\nvalidated value: ${formatValue(definition.validatedValue)}`
      return message
    }

    case "LazyDefinition": {
      let message = ""
      message += `\norigin: ${urlRelativeToCwd(definition.origin.url)}`
      message += `\nname: ${definition.name}`
      message += `\nexp: ${formatExp(definition.exp)}`
      if (definition.value)
        message += `\nvalue: ${formatValue(definition.value)}`
      if (definition.schema)
        message += `\nschema: ${formatValue(definition.schema)}`
      if (definition.validatedValue)
        message += `\nvalidated value: ${formatValue(definition.validatedValue)}`
      return message
    }
  }
}
