import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { sexpConfig } from "./sexpConfig.ts"

export const prettyExp = S.formatPrettySexpByFormat(M.formatExp, sexpConfig)
export const prettyModStmts = S.formatPrettySexpByFormat(
  M.formatModStmts,
  sexpConfig,
)
export const prettyFragmentStmts = S.formatPrettySexpByFormat(
  M.formatFragmentStmts,
  sexpConfig,
)
export const prettyModDefinitions = S.formatPrettySexpByFormat(
  M.formatModDefinitions,
  sexpConfig,
)
