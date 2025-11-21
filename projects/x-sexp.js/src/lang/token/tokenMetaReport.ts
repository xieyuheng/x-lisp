import { urlRelativeToCwd } from "../../helpers/url/urlRelativeToCwd.ts"
import { spanReport, type Position } from "../span/index.ts"
import { type TokenMeta } from "./Token.ts"

export function tokenMetaReport(meta: TokenMeta): string {
  let message = ""
  const context = spanReport(meta.span, meta.text)
  if (meta.url) {
    const index = context.indexOf("|")
    if (index - 1 > 0) {
      message += " ".repeat(index - 1)
    }

    message += `--> ${urlRelativeToCwd(meta.url)}:${formatPosition(meta.span.start)}\n`
  }

  message += context
  return message
}

function formatPosition(position: Position): string {
  return `${position.row + 1}:${position.column + 1}`
}
