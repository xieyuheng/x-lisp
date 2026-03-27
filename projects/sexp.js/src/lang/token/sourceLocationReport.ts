import { pathRelativeToCwd } from "@xieyuheng/helpers.js/path"
import { spanReport, type Position } from "../span/index.ts"
import type { SourceLocation } from "./SourceLocation.ts"

export function sourceLocationReport(
  location: SourceLocation,
  errorMessage?: string,
): string {
  let message = ""
  const context = spanReport(location.span, location.text)
  if (location.path) {
    message += pathRelativeToCwd(location.path)
    message += ":"
    message += formatPosition(location.span.start)
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
