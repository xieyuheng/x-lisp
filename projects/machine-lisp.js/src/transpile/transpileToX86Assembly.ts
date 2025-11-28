import * as M from "../index.ts"
import { transpileBlock } from "./transpileBlock.ts"
import { transpileDirective } from "./transpileDirective.ts"
import { transpileOwnName } from "./transpileOwnName.ts"

const indentation = " ".repeat(8)

export function transpileToX86Assembly(mod: M.Mod): string {
  let code = ""

  for (const name of mod.exported) {
    code += `.global ${transpileOwnName([name])}\n`
  }

  for (const definition of M.modDefinitions(mod)) {
    code += "\n"
    code += transpileDefinition(definition)
  }

  return code
}

function transpileDefinition(definition: M.Definition): string {
  switch (definition.kind) {
    case "CodeDefinition": {
      const name = transpileOwnName([definition.name])
      const blocks = Array.from(definition.blocks.values())
        .map((block) => transpileBlock({ definition }, block))
        .join("\n")
      let code = `.text\n`
      code += `.align 8\n`
      code += `.type ${name}, @function\n`
      code += `${name}:\n`
      code += `${blocks}\n`
      code += `.size ${name}, . - ${name}\n`
      return code
    }

    case "DataDefinition": {
      const name = transpileOwnName([definition.name])
      const directives = definition.directives
        .map((directive) => transpileDirective({ definition }, directive))
        .join("\n")
      let code = `.data\n`
      code += `.align 8\n`
      code += `.type ${name}, @object\n`
      code += `${name}:\n`
      code += `${directives}\n`
      code += `.size ${name}, . - ${name}\n`
      return code
    }

    case "SpaceDefinition": {
      const name = transpileOwnName([definition.name])
      let code = `.bss\n`
      code += `.align 8\n`
      code += `${name}:\n`
      code += `${indentation}.zero ${definition.size}\n`
      return code
    }
  }
}
