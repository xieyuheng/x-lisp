import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import * as L from "../index.ts"

export function apply(target: L.Value, args: Array<L.Value>): L.Value {
  switch (target.kind) {
    case "PrimitiveFunctionValue": {
      return target.definition.fn(...args)
    }

    default: {
      let message = `[apply] can not handle this kind of target`
      message += formatUnderTag(2, `target:`, L.formatValue(target))
      message += formatUnderTag(2, `args:`, L.formatValues(args))
      throw new Error(message)
    }
  }
}
