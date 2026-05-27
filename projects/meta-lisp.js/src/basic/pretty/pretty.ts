import * as S from "@xieyuheng/sexp.js"
import { formatDefinition } from "../format/formatDefinition.ts"
import { sexpConfig } from "./sexpConfig.ts"

export const prettyDefinition = S.formatPrettySexpByFormat(
  formatDefinition,
  sexpConfig,
)
