import { type Atom } from "../value/index.ts"

export function formatAtom(value: Atom): string {
  switch (value.kind) {
    case "Hashtag": {
      return `#${value.content}`
    }

    case "Symbol": {
      return `'${value.content}`
    }

    case "String": {
      return JSON.stringify(value.content)
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

    case "Undefined": {
      return `<undefined>`
    }
  }
}
