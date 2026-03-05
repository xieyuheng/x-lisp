import { urlRelativeToCwd } from "@xieyuheng/helpers.js/url"
import { spanReport, type Position } from "../span/index.ts"
import { type TokenMeta } from "./Token.ts"

export function tokenMetaReport(
  meta: TokenMeta,
  errorMessage?: string,
): string {
  let message = ""
  const context = spanReport(meta.span, meta.text)
  if (meta.url) {
    message += urlRelativeToCwd(meta.url)
    message += ":"
    message += formatPosition(meta.span.start)
    if (errorMessage) {
      message += ` -- `
      message += errorMessage
    }
    message += "\n"
  }

  message += context
  return message
}

function formatPosition(position: Position): string {
  return `${position.row + 1}:${position.column + 1}`
}
