import * as S from "@xieyuheng/sexp.js"
import { formatDefinition, formatMod } from "../format/index.ts"
import { sexpConfig } from "./sexpConfig.ts"

export const prettyDefinition = S.prettySexpByFormat(
  formatDefinition,
  sexpConfig,
)

export const prettyMod = S.prettySexpByFormat(formatMod, sexpConfig)
