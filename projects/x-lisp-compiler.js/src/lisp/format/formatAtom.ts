import { type Atom } from "../exp/index.ts"

export function formatAtom(atom: Atom): string {
  switch (atom.kind) {
    case "Hashtag": {
      return `#${atom.content}`
    }

    case "Symbol": {
      return `'${atom.content}`
    }

    case "String": {
      return JSON.stringify(atom.content)
    }

    case "Int": {
      return atom.content.toString()
    }

    case "Float": {
      if (Number.isInteger(atom.content)) {
        return `${atom.content.toString()}.0`
      } else {
        return atom.content.toString()
      }
    }
  }
}
