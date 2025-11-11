import type { Block } from "../block/index.ts"
import type { Definition } from "../definition/index.ts"
import * as Definitions from "../definition/index.ts"
import type { Instr } from "../instr/index.ts"
import { modDefinitions, type Mod } from "../mod/index.ts"
import type { Operand } from "../operand/index.ts"
import * as Operands from "../operand/index.ts"

export function transpileToX86Assembly(mod: Mod): string {
  const definitions = modDefinitions(mod).map(transpileDefinition).join("\n\n")
  return definitions
}

type Context = {
  definition: Definitions.CodeDefinition
}

function transpileIdentifier(identifier: string): string {
  return identifier.split("").map(transpileChar).join("")
}

function transpileChar(char: string): string {
  switch (char) {
    case "-": return "_"
    case "/": return "."
    default: return char
  }
}

function transpileDefinition(definition: Definition): string {
  const name = transpileIdentifier(definition.name)
  const context = { definition }
  const blocks = Array.from(definition.blocks.values())
    .map((block) => transpileBlock(context, block))
    .join("\n")
  return `${name}:\n${blocks}`
}

function transpileBlock(context: Context, block: Block): string {
  const name = transpileIdentifier(context.definition.name)
  const label = transpileIdentifier(block.label)
  const instrs = block.instrs
    .map((instr) => transpileInstr(context, instr))
    .join("\n")
  return `${name}.${label}:\n${instrs}`
}

function transpileInstr(context: Context, instr: Instr): string {
  const operands = instr.operands.map(operand => transpileOperand(context, operand))
  return `${instr.op} ${operands}`
}

function transpileOperand(context: Context, operand: Operand): string {
  return "TODO"
}
