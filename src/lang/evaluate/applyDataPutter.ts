import { equal } from "../equal/index.ts"
import { formatValue } from "../format/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"

export function applyDataPutter(
  setter: Values.DataPutter,
  args: Array<Value>,
): Value {
  if (args.length !== 2) {
    let message = `[applyDataPutter] data setter can only take two arguments\n`
    message += `  target: ${formatValue(setter)}\n`
    message += `  args: [${args.map(formatValue).join(" ")}]\n`
    throw new Error(message)
  }

  const [value, data] = args

  if (data.kind !== "Data") {
    let message = `[applyDataPutter] data setter can only take data as the second argument\n`
    message += `  target: ${formatValue(setter)}\n`
    message += `  args: [${args.map(formatValue).join(" ")}]\n`
    throw new Error(message)
  }

  if (!equal(data.constructor, setter.constructor)) {
    let message = `[applyDataPutter] data setter constructor mismatch\n`
    message += `  target: ${formatValue(setter)}\n`
    message += `  args: [${args.map(formatValue).join(" ")}]\n`
    throw new Error(message)
  }

  data.elements[setter.fieldIndex] = value
  return data
}
