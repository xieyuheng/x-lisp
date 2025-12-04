import { numberAlign } from "@xieyuheng/helpers.js/number"
import assert from "node:assert"
import * as M from "../machine/index.ts"

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

    case "SpaceDefinition": {
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
  // TODO no callee saved for now
  const calleeSavedRegs: Array<M.Reg> = []

  // TODO all variables are spilled for now
  assert(definition.info["home-locations"])
  const spillCount = definition.info["home-locations"].size

  return {
    calleeSavedRegs,
    spillCount,
  }
}

function computeLocalVariableStackSpace(info: RegisterInfo): number {
  const calleeSavedSpace = info.calleeSavedRegs.length * 8
  const spilledSpace = info.spillCount * 8
  const totalSpace = numberAlign(16, calleeSavedSpace + spilledSpace)
  return totalSpace - calleeSavedSpace
}

function createPrologBlock(info: RegisterInfo): M.Block {
  const instrs: Array<M.Instr> = []
  instrs.push(M.Instr("pushq", [M.Reg("rbp")]))
  instrs.push(M.Instr("movq", [M.Reg("rsp"), M.Reg("rbp")]))
  instrs.push(...info.calleeSavedRegs.map((reg) => M.Instr("pushq", [reg])))
  const stackSpace = computeLocalVariableStackSpace(info)
  if (stackSpace !== 0)
    instrs.push(M.Instr("subq", [M.Imm(BigInt(stackSpace)), M.Reg("rsp")]))
  instrs.push(M.Instr("jmp", [M.Label("body", { isExternal: false })]))
  return M.Block("prolog", instrs)
}

function createEpilogBlock(info: RegisterInfo): M.Block {
  const instrs: Array<M.Instr> = []
  const stackSpace = computeLocalVariableStackSpace(info)
  if (stackSpace !== 0)
    instrs.push(M.Instr("addq", [M.Imm(BigInt(stackSpace)), M.Reg("rsp")]))
  instrs.push(
    ...info.calleeSavedRegs.map((reg) => M.Instr("popq", [reg])).toReversed(),
  )
  instrs.push(M.Instr("popq", [M.Reg("rbp")]))
  instrs.push(M.Instr("retq", []))
  return M.Block("epilog", instrs)
}
