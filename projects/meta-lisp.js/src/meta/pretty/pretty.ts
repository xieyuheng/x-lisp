import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { sexpConfig } from "./sexpConfig.ts"

export const formatPrettyExp = S.formatPrettySexpByFormat(
  M.formatExp,
  sexpConfig,
)
export const formatPrettyModStmts = S.formatPrettySexpByFormat(
  M.formatModStmts,
  sexpConfig,
)
export const formatPrettyFragmentStmts = S.formatPrettySexpByFormat(
  M.formatFragmentStmts,
  sexpConfig,
)
export const formatPrettyModDefinitions = S.formatPrettySexpByFormat(
  M.formatModDefinitions,
  sexpConfig,
)
