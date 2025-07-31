import { formatExp } from "../format/index.ts"
import { lambdaIsDefined, type Value } from "../value/index.ts"

export function formatValue(value: Value): string {
  switch (value.kind) {
    case "Lambda": {
      if (lambdaIsDefined(value)) {
        return value.definedName
      }

      return `(lambda (${value.name}) ${formatExp(value.ret)})`
    }
  }
}
