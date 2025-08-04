import * as X from "@xieyuheng/x-data.js"
import { urlPathRelativeToCwd } from "../../utils/url/urlPathRelativeToCwd.ts"
import type { Mod } from "./Mod.ts"

export function modReportSource(mod: Mod, span: X.Span): string {
  return `${urlPathRelativeToCwd(mod.url)}:${formatPosition(span.start)}`
}

function formatPosition(position: X.Position): string {
  return `${position.row + 1}:${position.column + 1}`
}
