import * as M from "../index.ts"
import { transpileName } from "./transpileName.ts"

const indentation = " ".repeat(8)

type Context = {
  definition: M.CodeDefinition
}

export function transpileBlock(context: Context, block: M.Block): string {
  const name = transpileName([context.definition.name, block.label])
  const instrs = block.instrs
    .map((instr) => transpileInstr(context, instr))
    .join("\n")
  return `${name}:\n${instrs}`
}

function transpileInstr(context: Context, instr: M.Instr): string {
  switch (instr.op) {
    case "callq-n": {
      const [label] = instr.operands
      return `${indentation}callq ${transpileOperand(context, label)}`
    }

    case "set-if": {
      const [cc, dest] = instr.operands
      const code = M.asCc(cc).code
      return `${indentation}set${code} ${transpileOperand(context, dest)}`
    }

    case "jmp-if": {
      const [cc, label] = instr.operands
      const code = M.asCc(cc).code
      return `${indentation}j${code} ${transpileOperand(context, label)}`
    }

    case "jmp-indirect": {
      const [label] = instr.operands
      return `${indentation}jmp *${transpileOperand(context, label)}`
    }

    case "jmp-indirect-if": {
      const [cc, label] = instr.operands
      const code = M.asCc(cc).code
      return `${indentation}j${code} *${transpileOperand(context, label)}`
    }

    case "branch-if": {
      const [cc, thenLabel, elseLabel] = instr.operands
      const code = M.asCc(cc).code
      return [
        `${indentation}j${code} ${transpileOperand(context, thenLabel)}`,
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

function transpileOperand(context: Context, operand: M.Operand): string {
  switch (operand.kind) {
    case "Imm": {
      return `$${operand.value}`
    }

    case "LabelImm": {
      const label = transpileLabel(context, operand.label)
      return `$${label}`
    }

    case "Var": {
      return `@(var ${operand.name})`
    }

    case "Reg": {
      return `%${operand.name}`
    }

    case "RegDeref": {
      return `${operand.offset}(%${operand.reg.name})`
    }

    case "LabelDeref": {
      const label = transpileLabel(context, operand.label)
      return `${label}(%rip)`
    }

    case "Label": {
      return transpileLabel(context, operand)
    }

    case "Arity": {
      return `@(arity ${operand.value})`
    }

    case "Cc": {
      return `@(cc ${operand.code})`
    }
  }
}

function transpileLabel(context: Context, label: M.Label): string {
  if (label.attributes.isExternal) {
    return transpileName([label.name])
  } else {
    if (context.definition.blocks.has(label.name)) {
      return transpileName([context.definition.name, label.name])
    } else {
      return transpileName([label.name])
    }
  }
}
