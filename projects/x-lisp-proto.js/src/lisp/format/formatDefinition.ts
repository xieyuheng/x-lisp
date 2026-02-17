import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import { urlRelativeToCwd } from "@xieyuheng/helpers.js/url"
import { textWidth } from "../../config.ts"
import type { Definition } from "../definition/index.ts"
import { prettyExp, prettyValue } from "../pretty/index.ts"

export function formatDefinition(definition: Definition): string {
  const width = textWidth
  switch (definition.kind) {
    case "ValueDefinition": {
      let message = ""
      message += `\nmod: ${urlRelativeToCwd(definition.mod.url)}`
      message += `\nname: ${definition.name}`
      message += formatUnderTag(
        0,
        `value:`,
        prettyValue(width, definition.value),
      )
      if (definition.schema)
        message += formatUnderTag(
          0,
          `schema:`,
          prettyValue(width, definition.schema),
        )
      if (definition.validatedValue)
        message += formatUnderTag(
          0,
          `validated value:`,
          prettyValue(width, definition.validatedValue),
        )
      return message
    }

    case "LazyDefinition": {
      let message = ""
      message += `\nmod: ${urlRelativeToCwd(definition.mod.url)}`
      message += `\nname: ${definition.name}`
      message += formatUnderTag(0, `exp:`, prettyExp(width, definition.exp))
      if (definition.value)
        message += formatUnderTag(
          0,
          `value:`,
          prettyValue(width, definition.value),
        )
      if (definition.schema)
        message += formatUnderTag(
          0,
          `schema:`,
          prettyValue(width, definition.schema),
        )
      if (definition.validatedValue)
        message += formatUnderTag(
          0,
          `validated value:`,
          prettyValue(width, definition.validatedValue),
        )
      return message
    }
  }
}
