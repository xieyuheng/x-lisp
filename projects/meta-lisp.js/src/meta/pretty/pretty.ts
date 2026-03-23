import * as S from "@xieyuheng/sexp.js"
import {
  formatExp,
  formatModDefinitions,
  formatModStmts,
} from "../format/index.ts"
import { sexpConfig } from "./sexpConfig.ts"

export const prettyExp = S.prettySexpByFormat(formatExp, sexpConfig)
export const prettyModStmts = S.prettySexpByFormat(formatModStmts, sexpConfig)
export const prettyModDefinitions = S.prettySexpByFormat(
  formatModDefinitions,
  sexpConfig,
)
