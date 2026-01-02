import * as B from "../basic/index.ts"
import * as M from "../machine/index.ts"
import { setupMetadata } from "./040-SelectInstructionPass.ts"

export function SetupVariableInfo(mod: M.Mod): void {
  for (const definition of M.modDefinitions(mod)) {
    if (definition.kind === "CodeDefinition") {
      const varNames = getVarNames(definition)
      const rootName = `${definition.name}©variable-info`
      const attributes: Record<string, B.Metadata> = {
        count: B.IntMetadata(BigInt(varNames.size)),
        names: B.ListMetadata(Array.from(varNames).map(B.StringMetadata)),
      }
      for (const newDefinition of setupMetadata(mod, rootName, attributes)) {
        mod.definitions.set(newDefinition.name, newDefinition)
      }
    }
  }
}

export function getVarNames(definition: M.CodeDefinition): Set<string> {
  const varNames: Set<string> = new Set()
  for (const block of definition.blocks.values()) {
    for (const instr of block.instrs) {
      for (const operand of instr.operands) {
        if (operand.kind === "Var") {
          varNames.add(operand.name)
        }
      }
    }
  }

  return varNames
}
