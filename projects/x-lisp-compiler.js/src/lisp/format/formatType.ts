import assert from "node:assert"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { formatBody } from "./index.ts"

// export function formatTypes(
//   values: Array<Value>,
// ): string {
//   return values.map((v) => formatValue(v, options)).join(" ")
// }

// function formatTypeRecord(
//   attributes: Record<string, Value>,
// ): string {
//   if (options.digest) {
//     return Object.keys(attributes)
//       .sort()
//       .map((k) => `:${k} ${formatValue(attributes[k], options)}`)
//       .join(" ")
//   } else {
//     return Object.entries(attributes)
//       .map(([k, v]) => `:${k} ${formatValue(v, options)}`)
//       .join(" ")
//   }
// }

export function formatType(value: Value): string {
  throw new Error()
}
