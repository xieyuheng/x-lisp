import * as X from "@xieyuheng/x-data.js"
import { urlRelativeToCwd } from "../../utils/url/urlRelativeToCwd.ts"
import type { Mod } from "./Mod.ts"

export function modReportSource(mod: Mod, span: X.Span): string {
  return `${urlRelativeToCwd(mod.url)}:${formatPosition(span.start)}`
}

function formatPosition(position: X.Position): string {
  return `${position.row + 1}:${position.column + 1}`
}
