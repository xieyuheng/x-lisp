import { type Directive } from "../directive/index.ts"

export function formatDirective(directive: Directive): string {
  switch (directive.kind) {
    case "Db": {
      const values = directive.values.map(String).join(" ")
      return `(db ${values})`
    }

    case "Dw": {
      const values = directive.values.map(String).join(" ")
      return `(dw ${values})`
    }

    case "Dd": {
      const values = directive.values.map(String).join(" ")
      return `(dd ${values})`
    }

    case "Dq": {
      const values = directive.values.map(String).join(" ")
      return `(dq ${values})`
    }

    case "String": {
      return `(string "${directive.content}")`
    }

    case "Int": {
      return `(int ${directive.content})`
    }

    case "Float": {
      return `(float ${directive.content})`
    }

    case "Pointer": {
      return `(pointer ${directive.name})`
    }
  }
}
