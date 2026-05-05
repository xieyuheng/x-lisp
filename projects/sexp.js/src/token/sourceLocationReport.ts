import { pathRelativeToCwd } from "@xieyuheng/helpers.js/path"
import fs from "node:fs"
import * as S from "../index.ts"
import type { SourceLocation } from "./SourceLocation.ts"

export function sourceLocationReport(
  location: SourceLocation,
  errorMessage?: string,
): string {
  const text = fs.existsSync(location.path)
    ? fs.readFileSync(location.path, "utf-8")
    : ""
  const context = S.spanReport(location.span, text)
  let message = ""
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

function formatPosition(position: S.Position): string {
  return `${position.row + 1}:${position.column + 1}`
}
