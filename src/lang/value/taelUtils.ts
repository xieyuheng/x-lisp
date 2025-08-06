import * as Values from "./Value.ts"
import { type Value } from "./Value.ts"

export function asTael(value: Value): Values.Tael {
  if (value.kind === "Tael") return value
  throw new Error(`[asTael] fail on: ${value.kind}`)
}
