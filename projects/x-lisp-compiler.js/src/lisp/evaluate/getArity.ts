import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import * as L from "../index.ts"

export function getApply(target: L.Value): number {
  switch (target.kind) {
    case "PrimitiveFunctionValue": {
      return target.definition.arity
    }

    case "ClosureValue": {
      return target.parameters.length
    }

    case "FunctionValue": {
      return target.definition.parameters.length
    }

    case "DatatypeConstructorValue": {
      return target.definition.datatypeConstructor.parameters.length
    }

    case "CurryValue": {
      return target.arity
    }

    default: {
      let message = `[getApply] can not handle this kind of target`
      message += formatUnderTag(2, `target:`, L.formatValue(target))
      throw new Error(message)
    }
  }
}
