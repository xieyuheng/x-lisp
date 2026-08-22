import { numberAlign } from "@xieyuheng/std.js/number"
import assert from "node:assert"
import * as X86 from "../../x86/index.ts"
import type { HomeInfo, HomeInfoMap } from "./198-AllocateRegistersPass.ts"

export function PrologEpilogPass(mod: X86.Mod, homeInfoMap: HomeInfoMap): void {
  for (const [name, definition] of mod.definitions) {
    if (X86.isCodeDefinition(definition)) {
      const homeInfo = homeInfoMap.get(name)
      assert(homeInfo)
      const stackSpace = computeStackSpace(homeInfo)
      definition.instrs = [
        X86.Instr("label", [X86.LabelOperand("prolog")]),
        ...makePrologInstrs(stackSpace),
        ...definition.instrs.flatMap((instr) =>
          expandPseudoInstr(stackSpace, instr),
        ),
        X86.Instr("label", [X86.LabelOperand("epilog")]),
        ...makeEpilogInstrs(stackSpace),
        X86.Instr("ret", []),
      ]
    }
  }
}

function computeStackSpace(homeInfo: HomeInfo): number {
  return numberAlign(16, homeInfo.locations.size * 8)
}

function makePrologInstrs(stackSpace: number): Array<X86.Instr> {
  return [
    X86.Instr("push", [X86.RegOperand("rbp")]),
    X86.Instr("mov", [X86.RegOperand("rbp"), X86.RegOperand("rsp")]),
    X86.Instr("sub", [
      X86.RegOperand("rsp"),
      X86.ImmOperand(BigInt(stackSpace)),
    ]),
  ]
}

function makeEpilogInstrs(stackSpace: number): Array<X86.Instr> {
  return [
    X86.Instr("add", [
      X86.RegOperand("rsp"),
      X86.ImmOperand(BigInt(stackSpace)),
    ]),
    X86.Instr("pop", [X86.RegOperand("rbp")]),
  ]
}

function expandPseudoInstr(
  stackSpace: number,
  instr: X86.Instr,
): Array<X86.Instr> {
  if (instr.op === "tail-jmp") {
    return [...makeEpilogInstrs(stackSpace), X86.Instr("jmp", instr.operands)]
  }

  return [instr]
}
