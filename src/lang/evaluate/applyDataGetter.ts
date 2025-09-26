import { formatValue, formatValues } from "../format/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"

export function applyDataGetter(
  getter: Values.DataGetter,
  args: Array<Value>,
): Value {
  if (args.length !== 1) {
    let message = `[applyDataGetter] data getter can only take one argument\n`
    message += `  target: ${formatValue(getter)}\n`
    message += `  args: ${formatValues(args)}\n`
    throw new Error(message)
  }

  const data = args[0]

  if (!Values.isData(data)) {
    let message = `[applyDataGetter] data getter can only take data as argument\n`
    message += `  target: ${formatValue(getter)}\n`
    message += `  args: ${formatValues(args)}\n`
    throw new Error(message)
  }

  if (Values.dataHashtag(data).content !== getter.constructor.name) {
    let message = `[applyDataGetter] data getter constructor mismatch\n`
    message += `  target: ${formatValue(getter)}\n`
    message += `  args: ${formatValues(args)}\n`
    throw new Error(message)
  }

  // index + 1 to pass the hashtag at the head.
  return Values.asTael(data).elements[getter.fieldIndex + 1]
}
