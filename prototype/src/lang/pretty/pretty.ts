import { formatExp, formatValue } from "../format/index.ts"
import type { Value } from "../value/index.ts"
import { prettySexpByFormat } from "./prettySexpByFormat.ts"

export const prettyExp = prettySexpByFormat(formatExp)
export const prettyValue = prettySexpByFormat(formatValue)

export function prettyValues(maxWidth: number, values: Array<Value>): string {
  return values.map((value) => prettyValue(maxWidth, value)).join("\n")
}
