import * as S from "@xieyuheng/sexp.js"
import {
  formatExp,
  formatFragmentStmts,
  formatModDefinitions,
  formatModStmts,
} from "../format/index.ts"
import { sexpConfig } from "./sexpConfig.ts"

export const prettyExp = S.prettySexpByFormat(formatExp, sexpConfig)
export const prettyModStmts = S.prettySexpByFormat(formatModStmts, sexpConfig)
export const prettyFragmentStmts = S.prettySexpByFormat(
  formatFragmentStmts,
  sexpConfig,
)
export const prettyModDefinitions = S.prettySexpByFormat(
  formatModDefinitions,
  sexpConfig,
)
