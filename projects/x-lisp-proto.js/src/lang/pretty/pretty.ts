import * as S from "@xieyuheng/x-sexp.js"
import { formatExp, formatValue } from "../format/index.ts"
import type { Value } from "../value/index.ts"
import { sexpConfig } from "./sexpConfig.ts"

export const prettyExp = S.prettySexpByFormat(formatExp, sexpConfig)
export const prettyValue = S.prettySexpByFormat(formatValue, sexpConfig)

export function prettyValues(maxWidth: number, values: Array<Value>): string {
  return values.map((value) => prettyValue(maxWidth, value)).join("\n")
}
