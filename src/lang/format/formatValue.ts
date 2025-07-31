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
      // TODO
      return `'${value.content}`
    }

    case "Int": {
      return value.content.toString()
    }

    case "Float": {
      return value.content.toString()
    }

    case "Lambda": {
      if (lambdaIsDefined(value)) {
        return value.definedName
      }

      return `(lambda (${value.name}) ${formatExp(value.ret)})`
    }
  }
}
