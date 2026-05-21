import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { sexpConfig } from "./sexpConfig.ts"

export const prettyExp = S.prettySexpByFormat(M.formatExp, sexpConfig)
export const prettyModStmts = S.prettySexpByFormat(M.formatModStmts, sexpConfig)
export const prettyFragmentStmts = S.prettySexpByFormat(
  M.formatFragmentStmts,
  sexpConfig,
)
export const prettyModDefinitions = S.prettySexpByFormat(
  M.formatModDefinitions,
  sexpConfig,
)
