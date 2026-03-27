import { tokenMetaReport, type SourceLocation } from "../token/index.ts"

export class ErrorWithSourceLocation extends Error {
  meta: SourceLocation

  constructor(message: string, meta: SourceLocation) {
    super(reportWithMeta(message, meta))
    this.meta = meta
  }
}

export function reportWithMeta(message: string, meta?: SourceLocation): string {
  if (meta) {
    message += "\n"
    message += tokenMetaReport(meta)
    return message
  } else {
    return message
  }
}
