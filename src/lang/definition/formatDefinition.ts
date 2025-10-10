import { globals } from "../../globals.ts"
import { formatUnderTag } from "../../helper/format/formatUnderTag.ts"
import { urlRelativeToCwd } from "../../helper/url/urlRelativeToCwd.ts"
import { prettyExp, prettyValue } from "../pretty/index.ts"
import type { Definition } from "./index.ts"

export function formatDefinition(definition: Definition): string {
  const maxWidth = globals.maxWidth
  switch (definition.kind) {
    case "ValueDefinition": {
      let message = ""
      message += `\norigin: ${urlRelativeToCwd(definition.origin.url)}`
      message += `\nname: ${definition.name}`
      message += formatUnderTag(
        0,
        `value:`,
        prettyValue(maxWidth, definition.value),
      )
      if (definition.schema)
        message += formatUnderTag(
          0,
          `schema:`,
          prettyValue(maxWidth, definition.schema),
        )
      if (definition.validatedValue)
        message += formatUnderTag(
          0,
          `validated value:`,
          prettyValue(maxWidth, definition.validatedValue),
        )
      return message
    }

    case "LazyDefinition": {
      let message = ""
      message += `\norigin: ${urlRelativeToCwd(definition.origin.url)}`
      message += `\nname: ${definition.name}`
      message += formatUnderTag(0, `exp:`, prettyExp(maxWidth, definition.exp))
      if (definition.value)
        message += formatUnderTag(
          0,
          `value:`,
          prettyValue(maxWidth, definition.value),
        )
      if (definition.schema)
        message += formatUnderTag(
          0,
          `schema:`,
          prettyValue(maxWidth, definition.schema),
        )
      if (definition.validatedValue)
        message += formatUnderTag(
          0,
          `validated value:`,
          prettyValue(maxWidth, definition.validatedValue),
        )
      return message
    }
  }
}
