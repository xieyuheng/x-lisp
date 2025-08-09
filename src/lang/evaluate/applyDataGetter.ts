import { equal } from "../equal/index.ts"
import { formatValue } from "../format/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"

export function applyDataGetter(
  getter: Values.DataGetter,
  args: Array<Value>,
): Value {
  if (args.length !== 1) {
    let message = `[applyDataGetter] data getter can only take one argument\n`
    message += `  target: ${formatValue(getter)}\n`
    message += `  args: [${args.map(formatValue).join(" ")}]\n`
    throw new Error(message)
  }

  const data = args[0]

  if (data.kind !== "Data") {
    let message = `[applyDataGetter] data getter can only take data as argument\n`
    message += `  target: ${formatValue(getter)}\n`
    message += `  args: [${args.map(formatValue).join(" ")}]\n`
    throw new Error(message)
  }

  if (!equal(data.constructor, getter.constructor)) {
    let message = `[applyDataGetter] data getter constructor mismatch\n`
    message += `  target: ${formatValue(getter)}\n`
    message += `  args: [${args.map(formatValue).join(" ")}]\n`
    throw new Error(message)
  }

  return data.elements[getter.fieldIndex]
}
