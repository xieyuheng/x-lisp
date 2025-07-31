import { formatAtom, formatExp } from "../format/index.ts"
import { isAtom, lambdaIsDefined, type Value } from "../value/index.ts"

export function formatValue(value: Value): string {
  if (isAtom(value)) {
    return formatAtom(value)
  }

  switch (value.kind) {
    case "Tael": {
      throw new Error()
    }

    case "Lambda": {
      if (lambdaIsDefined(value)) {
        return value.definedName
      }

      return `(lambda (${value.name}) ${formatExp(value.ret)})`
    }
  }
}
