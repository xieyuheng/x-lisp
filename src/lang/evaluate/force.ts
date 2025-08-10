import { formatValue } from "../format/index.ts"
import { type Value } from "../value/index.ts"

export function force(target: Value): Value {
  let message = `[force] unhandled target value kind\n`
  message += `  target: ${formatValue(target)}\n`
  throw new Error(message)
}
