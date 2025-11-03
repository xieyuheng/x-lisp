import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"

export function applyDataConstructorPredicate(
  target: Values.DataConstructorPredicate,
  value: Value,
): Value {
  if (target.constructor.fields.length === 0) {
    if (Values.isHashtag(value)) {
      return Values.Bool(target.constructor.name === value.content)
    }

    return Values.Bool(false)
  } else {
    if (Values.isData(value)) {
      return Values.Bool(
        target.constructor.name === Values.dataHashtag(value).content,
      )
    }

    return Values.Bool(false)
  }
}
