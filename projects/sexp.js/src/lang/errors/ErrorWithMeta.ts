import { tokenMetaReport, type TokenMeta } from "../token/index.ts"

export class ErrorWithMeta extends Error {
  meta: TokenMeta

  constructor(message: string, meta: TokenMeta) {
    super(reportWithMeta(message, meta))
    this.meta = meta
  }
}

function reportWithMeta(message: string, meta: TokenMeta): string {
  message += "\n"
  message += tokenMetaReport(meta)
  return message
}
