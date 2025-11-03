import { definePrimitiveFunction } from "../define/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutTest(mod: Mod) {
  definePrimitiveFunction(mod, "assert", 1, (value) => {
    if (!Values.isBool(value)) {
      let message = `(assert) value is not bool`
      message += `\n  value: ${formatValue(value)}`
      throw Error(message)
      // if (instr.meta) throw new X.ErrorWithMeta(message, instr.meta)
      // else throw Error(message)
    }

    if (Values.isFalse(value)) {
      let message = `(assert) assertion fail`
      throw Error(message)
      // if (instr.meta) throw new X.ErrorWithMeta(message, instr.meta)
      // else throw Error(message)
    }

    return Values.Void()
  })
}
