import { stringHasBlank } from "../../utils/string/stringHasBlank.ts"
import { formatExp } from "../format/index.ts"
import { lambdaIsDefined, type Value } from "../value/index.ts"

export function formatValue(value: Value): string {
  switch (value.kind) {
    case "Bool": {
      if (value.content) {
        return "#t"
      } else {
        return "#f"
      }
    }

    case "String": {
      if (stringHasBlank(value.content)) {
        return JSON.stringify(value.content)
      } else {
        return `'${value.content}`
      }
    }

    case "Int": {
      return value.content.toString()
    }

    case "Float": {
      if (Number.isInteger(value.content)) {
        return `${value.content.toString()}.0`
      } else {
        return value.content.toString()
      }
    }

    case "Lambda": {
      if (lambdaIsDefined(value)) {
        return value.definedName
      }

      return `(lambda (${value.name}) ${formatExp(value.ret)})`
    }
  }
}
