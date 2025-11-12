import type { Block } from "../block/index.ts"
import * as Definitions from "../definition/index.ts"
import { formatOperand } from "../format/index.ts"
import type { Instr } from "../instr/index.ts"
import type { Operand } from "../operand/index.ts"
import { transpileIdentifier } from "./transpileIdentifier.ts"

const indentation = " ".repeat(8)

type Context = {
  definition: Definitions.CodeDefinition
}

export function transpileBlock(context: Context, block: Block): string {
  const name = transpileIdentifier([context.definition.name, block.label])
  const instrs = block.instrs
    .map((instr) => transpileInstr(context, instr))
    .join("\n")
  return `${name}:\n${instrs}`
}

function transpileInstr(context: Context, instr: Instr): string {
  const operands = instr.operands
    .map((operand) => transpileOperand(context, operand))
    .join(", ")
  return `${indentation}${instr.op} ${operands}`
}

function transpileOperand(context: Context, operand: Operand): string {
  switch (operand.kind) {
    case "Imm": {
      if (!Number.isInteger(operand.value)) {
        let message = `[transpileOperand/Imm] expect value to be integer`
        message += `\n  value: ${operand.value}`
        throw new Error(message)
      }

      return `$${operand.value}`
    }

    case "Var": {
      let message = `[transpileOperand/Var] var should be home before transpiling`
      message += `\n  variable: ${formatOperand(operand)}`
      throw new Error(message)
    }

    case "Reg": {
      return `%${operand.name}`
    }

    case "Mem": {
      if (!Number.isInteger(operand.offset)) {
        let message = `[transpileOperand/Mem] expect offset to be integer`
        message += `\n  value: ${operand.offset}`
        throw new Error(message)
      }

      return `${operand.offset}(%${operand.regName})`
    }

    case "Label": {
      if (context.definition.blocks.has(operand.name)) {
        return transpileIdentifier([context.definition.name, operand.name])
      } else {
        return transpileIdentifier([operand.name])
      }
    }
  }
}
