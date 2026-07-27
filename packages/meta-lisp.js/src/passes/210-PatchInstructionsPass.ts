import * as X86 from "../x86/index.ts"

export function PatchInstructionsPass(x86Mod: X86.Mod): X86.Mod {
  const newMod: X86.Mod = { definitions: new Map() }

  for (const definition of x86Mod.definitions.values()) {
    if (definition.kind !== "CodeDefinition") {
      newMod.definitions.set(definition.name, definition)
      continue
    }

    const newBlocks = definition.blocks.map((block) => patchBlock(block))
    newMod.definitions.set(
      definition.name,
      X86.CodeDefinition(definition.name, newBlocks),
    )
  }

  return newMod
}

function patchBlock(block: X86.Block): X86.Block {
  const patchedInstrs = block.instrs.flatMap((instr) => patchInstr(instr))
  return X86.Block(block.label, patchedInstrs)
}

function patchInstr(instr: X86.Instr): Array<X86.Instr> {
  if (instr.op === "tail-jmp" || instr.op === "label") {
    return [instr]
  }

  const [dst, src] = instr.operands

  if (
    instr.op === "mov" &&
    dst?.kind === "RegDerefOperand" &&
    src?.kind === "RegDerefOperand" &&
    isSameRegDeref(dst, src)
  ) {
    return []
  }

  if (dst?.kind === "RegDerefOperand" && src?.kind === "RegDerefOperand") {
    return patchTwoMemory(instr)
  }

  if (dst?.kind === "RegDerefOperand" && requiresRegDst(instr.op)) {
    return patchRegDstRequired(instr)
  }

  return [instr]
}

const regDstRequiredOps = new Set(["shl", "shr", "sar", "imul", "movzx"])

function requiresRegDst(op: string): boolean {
  return regDstRequiredOps.has(op)
}

function isSameRegDeref(
  a: X86.RegDerefOperand,
  b: X86.RegDerefOperand,
): boolean {
  if (a.base !== b.base) return false
  if (a.index !== b.index) return false
  if (a.scale !== b.scale) return false
  if (a.disp === undefined && b.disp === undefined) return true
  if (a.disp === undefined || b.disp === undefined) return false
  if (a.disp.kind !== "IntDisplacement" || b.disp.kind !== "IntDisplacement")
    return false
  return a.disp.value === b.disp.value
}

function patchTwoMemory(instr: X86.Instr): Array<X86.Instr> {
  const [dst, src] = instr.operands as [
    X86.RegDerefOperand,
    X86.RegDerefOperand,
  ]

  switch (instr.op) {
    case "mov": {
      return [
        X86.Instr("mov", [X86.RegOperand("rax"), src]),
        X86.Instr("mov", [dst, X86.RegOperand("rax")]),
      ]
    }

    case "add":
    case "sub":
    case "and":
    case "or":
    case "xor":
    case "cmp": {
      return [
        X86.Instr("mov", [X86.RegOperand("rax"), src]),
        X86.Instr(instr.op, [dst, X86.RegOperand("rax")]),
      ]
    }

    case "shl":
    case "shr":
    case "sar": {
      return [
        X86.Instr("mov", [X86.RegOperand("rax"), dst]),
        X86.Instr("mov", [X86.RegOperand("rcx"), src]),
        X86.Instr(instr.op, [X86.RegOperand("rax"), X86.RegOperand("rcx")]),
        X86.Instr("mov", [dst, X86.RegOperand("rax")]),
      ]
    }

    case "imul": {
      return [
        X86.Instr("mov", [X86.RegOperand("rax"), src]),
        X86.Instr(instr.op, [X86.RegOperand("rax"), dst]),
        X86.Instr("mov", [dst, X86.RegOperand("rax")]),
      ]
    }

    default: {
      return [instr]
    }
  }
}

function patchRegDstRequired(instr: X86.Instr): Array<X86.Instr> {
  const [dst, src] = instr.operands

  switch (instr.op) {
    case "shl":
    case "shr":
    case "sar": {
      if (src?.kind === "ImmOperand") {
        return [
          X86.Instr("mov", [X86.RegOperand("rax"), dst]),
          X86.Instr(instr.op, [X86.RegOperand("rax"), src]),
          X86.Instr("mov", [dst, X86.RegOperand("rax")]),
        ]
      }
      return [instr]
    }

    case "movzx": {
      if (src?.kind === "RegOperand") {
        return [
          X86.Instr(instr.op, [X86.RegOperand("rax"), src]),
          X86.Instr("mov", [dst, X86.RegOperand("rax")]),
        ]
      }
      return [instr]
    }

    case "imul": {
      return [
        X86.Instr("mov", [X86.RegOperand("rax"), dst]),
        X86.Instr(instr.op, [X86.RegOperand("rax"), src]),
        X86.Instr("mov", [dst, X86.RegOperand("rax")]),
      ]
    }

    default: {
      return [instr]
    }
  }
}
