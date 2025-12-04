import type { Definition } from "./Definition.ts"

export function definitionArity(definition: Definition): number {
  switch (definition.kind) {
    case "FunctionDefinition": {
      return Math.max(
        0,
        ...definition.blocks
          .values()
          .flatMap((block) => block.instrs)
          .filter((instr) => instr.op === "Argument")
          .map((instr) => instr.index + 1),
      )
    }

    case "PrimitiveFunctionDefinition": {
      return definition.arity
    }

    default: {
      let message = `[definitionArity] unhandle kind`
      message += `\n  definition kind: ${definition.kind}`
      throw new Error(message)
    }
  }
}
