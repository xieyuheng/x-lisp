import assert from "node:assert"
import { flags } from "../../flags.ts"
import { useBuiltinPreludeMod } from "../builtin/index.ts"
import { formatValue } from "../format/index.ts"
import { modLookupValue } from "../mod/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"
import { applyDataPredicate } from "./applyDataPredicate.ts"

export function applyDataConstructor(
  constructor: Values.DataConstructor,
  args: Array<Value>,
): Value {
  const data = Values.Data(constructor, args)

  if (flags.debug) {
    const preludeMod = useBuiltinPreludeMod()
    const isAnything = modLookupValue(preludeMod, "anything?")
    assert(isAnything)
    const predicate = constructor.spec.predicate
    const result = applyDataPredicate(predicate, [
      ...predicate.parameters.map((_) => isAnything),
      data,
    ])
    assert(Values.isBool(result))
    if (Values.isFalse(result)) {
      let message = `[applyDataConstructor] invalid args\n`
      message += `  constructor: ${formatValue(constructor)}\n`
      message += `  args: [${args.map(formatValue).join(" ")}]\n`
      message += `  result data: ${formatValue(data)}\n`
      message += `  data candoes not pass predicate: ${formatValue(predicate)}\n`
      throw new Error(message)
    }
  }

  return data
}

// function dataMightPassDataPredicate
