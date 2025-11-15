import type { Block } from "../block/index.ts"
import * as Definitions from "../definition/index.ts"
import type { Instr } from "../instr/index.ts"
import type { Operand } from "../operand/index.ts"
import * as Operands from "../operand/index.ts"
import { transpileName } from "./transpileName.ts"

const indentation = " ".repeat(8)

type Context = {
  definition: Definitions.CodeDefinition
}

export function transpileBlock(context: Context, block: Block): string {
  const name = transpileName([context.definition.name, block.label])
  const instrs = block.instrs
    .map((instr) => transpileInstr(context, instr))
    .join("\n")
  return `${name}:\n${instrs}`
}

function transpileInstr(context: Context, instr: Instr): string {
  switch (instr.op) {
    case "callq-n": {
      const [label] = instr.operands
      return `${indentation}callq ${transpileOperand(context, label)}`
    }

    case "set-if": {
      const [cc, dest] = instr.operands
      const code = Operands.asCc(cc).code
      return `${indentation}set${code} ${transpileOperand(context, dest)}`
    }

    case "jmp-if": {
      const [cc, label] = instr.operands
      const code = Operands.asCc(cc).code
      return `${indentation}jmp${code} ${transpileOperand(context, label)}`
    }

    case "jmp-indirect": {
      const [label] = instr.operands
      return `${indentation}jmp *${transpileOperand(context, label)}`
    }

    case "jmp-indirect-if": {
      const [cc, label] = instr.operands
      const code = Operands.asCc(cc).code
      return `${indentation}jmp${code} *${transpileOperand(context, label)}`
    }

    case "branch-if": {
      const [cc, thenLabel, elseLabel] = instr.operands
      const code = Operands.asCc(cc).code
      return [
        `${indentation}jmp${code} ${transpileOperand(context, thenLabel)}`,
        `${indentation}jmp ${transpileOperand(context, elseLabel)}`,
      ].join("\n")
    }

    default: {
      const operands = instr.operands
        .map((operand) => transpileOperand(context, operand))
        .join(", ")
      return `${indentation}${instr.op} ${operands}`
    }
  }
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

    case "ImmLabel": {
      const label = transpileLabel(context, operand.label.name)
      return `$${label}`
    }

    case "Var": {
      return `@(var ${operand.name})`
    }

    case "Reg": {
      return `%${operand.name}`
    }

    case "DerefReg": {
      if (!Number.isInteger(operand.offset)) {
        let message = `[transpileOperand/DerefReg] expect offset to be integer`
        message += `\n  value: ${operand.offset}`
        throw new Error(message)
      }

      return `${operand.offset}(%${operand.reg.name})`
    }

    case "DerefLabel": {
      const label = transpileLabel(context, operand.label.name)
      return `${label}(%rip)`
    }

    case "Label": {
      return transpileLabel(context, operand.name)
    }

    case "Arity": {
      return `@(arity ${operand.value})`
    }

    case "Cc": {
      return `@(cc ${operand.code})`
    }
  }
}

function transpileLabel(context: Context, label: string): string {
  if (context.definition.blocks.has(label)) {
    return transpileName([context.definition.name, label])
  } else {
    return transpileName([label])
  }
}
