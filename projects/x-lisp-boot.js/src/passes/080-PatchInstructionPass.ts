import * as M from "../machine/index.ts"

export function PatchInstructionPass(mod: M.Mod): void {
  for (const definition of M.modDefinitions(mod)) {
    onDefinition(definition)
  }
}

function onDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "CodeDefinition": {
      const blocks = Array.from(definition.blocks.values())
      for (const block of blocks) {
        definition.blocks.set(block.label, onBlock(block))
      }

      return null
    }

    case "DataDefinition": {
      return null
    }

    case "SpaceDefinition": {
      return null
    }
  }
}

function onBlock(block: M.Block): M.Block {
  return M.Block(block.label, block.instrs.flatMap(onInstr), block.meta)
}

function onInstr(instr: M.Instr): Array<M.Instr> {
  // remove self move instruction
  if (
    instr.op === "movq" &&
    M.equalOperand(instr.operands[0], instr.operands[1])
  ) {
    return []
  }

  // the second operand of movzbq must be register
  if (instr.op === "movzbq" && !M.isReg(instr.operands[1])) {
    return [
      M.Instr("movq", [instr.operands[1], M.Reg("rax")]),
      M.Instr("movzbq", [instr.operands[0], M.Reg("rax")]),
    ]
  }

  // the second operand of leaq must be register
  if (instr.op === "leaq" && !M.isReg(instr.operands[1])) {
    return [
      M.Instr("movq", [instr.operands[1], M.Reg("rax")]),
      M.Instr("leaq", [instr.operands[0], M.Reg("rax")]),
    ]
  }

  // the second operand of cmpq must NOT be immediate
  if (instr.op === "cmpq" && M.isImm(instr.operands[1])) {
    return [
      M.Instr("movq", [instr.operands[1], M.Reg("rax")]),
      M.Instr("cmpq", [instr.operands[0], M.Reg("rax")]),
    ]
  }

  // fix two memory location operands
  if (
    instr.operands.length === 2 &&
    M.isDeref(instr.operands[0]) &&
    M.isDeref(instr.operands[1])
  ) {
    return [
      M.Instr("movq", [instr.operands[0], M.Reg("rax")]),
      M.Instr(instr.op, [M.Reg("rax"), instr.operands[1]]),
    ]
  }

  return [instr]
}
