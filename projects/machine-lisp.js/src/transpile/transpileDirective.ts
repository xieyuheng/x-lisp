import * as M from "../index.ts"
import { transpileName } from "./transpileName.ts"

const indentation = " ".repeat(8)

type Context = {
  definition: M.DataDefinition
}

export function transpileDirective(
  context: Context,
  directive: M.Directive,
): string {
  switch (directive.kind) {
    case "Db": {
      const values = directive.values.map(String).join(" ")
      return `${indentation}.byte ${values}`
    }

    case "Dw": {
      const values = directive.values.map(String).join(" ")
      return `${indentation}.word ${values}`
    }

    case "Dd": {
      const values = directive.values.map(String).join(" ")
      return `${indentation}.long ${values}`
    }

    case "Dq": {
      const values = directive.values.map(String).join(" ")
      return `${indentation}.quad ${values}`
    }

    case "String": {
      const content = JSON.stringify(directive.content)
      return `${indentation}.string ${content}`
    }

    case "Int": {
      return `${indentation}.quad ${directive.content}`
    }

    case "Float": {
      return `${indentation}.double ${directive.content}`
    }

    case "Pointer": {
      return `${indentation}.quad ${transpileName([directive.name])}`
    }
  }
}
