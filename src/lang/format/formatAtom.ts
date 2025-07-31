import { stringHasBlank } from "../../utils/string/stringHasBlank.ts"
import { type Atom } from "../value/index.ts"

export function formatAtom(value: Atom): string {
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
  }
}
