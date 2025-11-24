import assert from "node:assert"
import * as M from "../index.ts"

export function PrologAndEpilogPass(mod: M.Mod): void {
  for (const definition of M.modDefinitions(mod)) {
    onDefinition(definition)
  }
}

type RegisterInfo = {
  calleeSavedRegs: Array<M.Reg>
  spillCount: number
}

function onDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "CodeDefinition": {
      const blockEntries = definition.blocks
        .values()
        .map(patchBlock)
        .map<[string, M.Block]>((block) => [block.label, block])
      const info = createRegisterInfo(definition)
      const prologBlock = createPrologBlock(info)
      const epilogBlock = createEpilogBlock(info)
      definition.blocks = new Map([
        [prologBlock.label, prologBlock],
        ...blockEntries,
        [epilogBlock.label, epilogBlock],
      ])

      return null
    }

    case "DataDefinition": {
      return null
    }
  }
}

function patchBlock(block: M.Block): M.Block {
  return M.Block(block.label, block.instrs.map(patchInstr), block.meta)
}

function patchInstr(instr: M.Instr): M.Instr {
  if (instr.op === "retq") {
    return M.Instr(
      "jmp",
      [M.Label("epilog", { isExternal: false })],
      instr.meta,
    )
  }

  return instr
}

function createRegisterInfo(definition: M.CodeDefinition): RegisterInfo {
  // TODO save all for now
  const calleeSavedRegNames = M.ABIs["x86-64-sysv"]["callee-saved-reg-names"]
  const calleeSavedRegs = calleeSavedRegNames.map((name) => M.Reg(name))

  // TODO all variables are spilled for now
  assert(definition.info["home-locations"])
  const spillCount = definition.info["home-locations"].size

  return {
    calleeSavedRegs,
    spillCount,
  }
}

function leaveStackSpace(info: RegisterInfo): number {
  let stackSpace = 0
  stackSpace += info.calleeSavedRegs.length * 8
  stackSpace += info.spillCount * 8
  return stackSpace
}

function createPrologBlock(info: RegisterInfo): M.Block {
  const instrs: Array<M.Instr> = []
  instrs.push(M.Instr("pushq", [M.Reg("rbp")]))
  instrs.push(M.Instr("movq", [M.Reg("rsp"), M.Reg("rbp")]))
  instrs.push(...info.calleeSavedRegs.map((reg) => M.Instr("pushq", [reg])))
  const stackSpace = leaveStackSpace(info)
  if (stackSpace !== 0)
    instrs.push(M.Instr("subq", [M.Imm(stackSpace), M.Reg("rsp")]))
  instrs.push(M.Instr("jmp", [M.Label("body", { isExternal: false })]))
  return M.Block("prolog", instrs)
}

function createEpilogBlock(info: RegisterInfo): M.Block {
  const instrs: Array<M.Instr> = []
  const stackSpace = leaveStackSpace(info)
  if (stackSpace !== 0)
    instrs.push(M.Instr("addq", [M.Imm(stackSpace), M.Reg("rsp")]))
  instrs.push(
    ...info.calleeSavedRegs.map((reg) => M.Instr("popq", [reg])).toReversed(),
  )
  instrs.push(M.Instr("popq", [M.Reg("rbp")]))
  instrs.push(M.Instr("retq", []))
  return M.Block("epilog", instrs)
}
