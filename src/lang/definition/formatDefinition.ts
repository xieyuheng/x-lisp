import { urlRelativeToCwd } from "../../utils/url/urlRelativeToCwd.ts"
import { formatExp, formatValue } from "../format/index.ts"
import type { Definition } from "./index.ts"

export function formatDefinition(definition: Definition): string {
  switch (definition.kind) {
    case "ValueDefinition": {
      let message = ""
      message += `origin: ${urlRelativeToCwd(definition.origin.url)}\n`
      message += `name: ${definition.name}\n`
      message += `value: ${formatValue(definition.value)}\n`
      if (definition.schema)
        message += `schema: ${formatValue(definition.schema)}\n`
      if (definition.validatedValue)
        message += `validated value: ${formatValue(definition.validatedValue)}\n`
      return message
    }

    case "LazyDefinition": {
      let message = ""
      message += `origin: ${urlRelativeToCwd(definition.origin.url)}\n`
      message += `name: ${definition.name}\n`
      message += `exp: ${formatExp(definition.exp)}\n`
      if (definition.value)
        message += `value: ${formatValue(definition.value)}\n`
      if (definition.schema)
        message += `schema: ${formatValue(definition.schema)}\n`
      if (definition.validatedValue)
        message += `validated value: ${formatValue(definition.validatedValue)}\n`
      return message
    }
  }
}
