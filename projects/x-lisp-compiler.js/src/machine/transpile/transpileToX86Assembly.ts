import * as M from "../index.ts"
import { transpileBlock } from "./transpileBlock.ts"
import { transpileDirective } from "./transpileDirective.ts"
import { transpileName } from "./transpileName.ts"

const indentation = " ".repeat(8)

export function transpileToX86Assembly(mod: M.Mod): string {
  let code = ""

  for (const name of mod.exported) {
    code += `${indentation}.global ${transpileName([name])}\n`
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
      const name = transpileName([definition.name])
      const blocks = Array.from(definition.blocks.values())
        .map((block) => transpileBlock({ definition }, block))
        .join("\n")
      let code = `${indentation}.section .text\n`
      code += `${indentation}.align 8\n`
      code += `${indentation}.type ${name}, @function\n`
      code += `${name}:\n`
      code += `${blocks}\n`
      code += `${name}.end:\n`
      code += `${indentation}.size ${name}, . - ${name}\n`
      return code
    }

    case "DataDefinition": {
      const name = transpileName([definition.name])
      const directives = definition.directives
        .map((directive) => transpileDirective({ definition }, directive))
        .join("\n")
      let code = `${indentation}.section .data\n`
      code += `${indentation}.align 8\n`
      code += `${indentation}.type ${name}, @object\n`
      code += `${name}:\n`
      code += `${directives}\n`
      code += `${indentation}.size ${name}, . - ${name}\n`
      return code
    }

    case "SpaceDefinition": {
      const name = transpileName([definition.name])
      let code = `${indentation}.section .bss\n`
      code += `${indentation}.align 8\n`
      code += `${name}:\n`
      code += `${indentation}.zero ${definition.size}\n`
      return code
    }
  }
}
