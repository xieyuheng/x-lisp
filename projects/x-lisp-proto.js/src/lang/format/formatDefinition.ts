import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import { urlRelativeToCwd } from "@xieyuheng/helpers.js/url"
import { globals } from "../../globals.ts"
import type { Definition } from "../definition/index.ts"
import { prettyExp, prettyValue } from "../pretty/index.ts"

export function formatDefinition(definition: Definition): string {
  const maxWidth = globals.maxWidth
  switch (definition.kind) {
    case "ValueDefinition": {
      let message = ""
      message += `\nmod: ${urlRelativeToCwd(definition.mod.url)}`
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
      message += `\nmod: ${urlRelativeToCwd(definition.mod.url)}`
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
