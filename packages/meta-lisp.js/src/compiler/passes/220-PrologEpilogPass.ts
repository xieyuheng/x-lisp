import assert from "node:assert";
import * as X86 from "../../x86/index.ts"
import type { HomeInfo, HomeInfoMap } from "./198-AllocateRegistersPass.ts";
import { numberAlign } from "@xieyuheng/std.js/number";

export function PrologEpilogPass(
  mod: X86.Mod,
  homeInfoMap: HomeInfoMap,
): void {
  for (const [name, definition] of mod.definitions) {
    if (X86.isCodeDefinition(definition)) {
      const homeInfo = homeInfoMap.get(name)
      assert(homeInfo)
      const stackSpace = computeStackSpace(homeInfo)
      definition.instrs = prologEpilogDefinition(
        definition.name,
        definition.instrs,
        stackSpace,
      )
    }
  }
}

function computeStackSpace(
  homeInfo: HomeInfo,
): number {
  return numberAlign(16, (homeInfo.locations.size * 8))
}

function prologEpilogDefinition(
  funcName: string,
  instrs: Array<X86.Instr>,
  stackSpace: number,
): Array<X86.Instr> {
  const withTailJmpExpanded = expandTailJmps(instrs, stackSpace)

  const idx = withTailJmpExpanded.findIndex(
    (instr) => instr.op === "label" && labelOf(instr) === "body",
  )
  if (idx === -1) return withTailJmpExpanded

  const prologInstrs = [
    X86.Instr("push", [X86.RegOperand("rbp")]),
    X86.Instr("mov", [X86.RegOperand("rbp"), X86.RegOperand("rsp")]),
    ...(stackSpace > 0
      ? [
        X86.Instr("sub", [
          X86.RegOperand("rsp"),
          X86.ImmOperand(BigInt(stackSpace)),
        ]),
      ]
      : []),
  ]

  const result: Array<X86.Instr> = []
  for (const instr of withTailJmpExpanded) {
    if (instr.op === "ret") {
      result.push(X86.Instr("jmp", [X86.LabelOperand("epilog")]))
      continue
    }
    result.push(instr)
    if (instr.op === "label" && labelOf(instr) === "body") {
      result.push(...prologInstrs)
    }
  }

  result.push(
    X86.Instr("label", [X86.LabelOperand("epilog")]),
    ...makeEpilogBody(stackSpace),
    X86.Instr("ret", []),
  )

  return result
}

function labelOf(instr: X86.Instr): string {
  const [op] = instr.operands
  if (op.kind !== "LabelOperand") {
    let message = `[labelOf] expected LabelOperand`
    throw new Error(message)
  }
  return op.name
}

function makeEpilogBody(stackSpace: number): Array<X86.Instr> {
  const body: Array<X86.Instr> = []
  if (stackSpace > 0) {
    body.push(
      X86.Instr("add", [
        X86.RegOperand("rsp"),
        X86.ImmOperand(BigInt(stackSpace)),
      ]),
    )
  }
  body.push(X86.Instr("pop", [X86.RegOperand("rbp")]))
  return body
}

function expandTailJmps(
  instrs: Array<X86.Instr>,
  stackSpace: number,
): Array<X86.Instr> {
  const epilogBody = makeEpilogBody(stackSpace)
  return instrs.flatMap((instr) => {
    if (instr.op !== "tail-jmp") return [instr]
    const [target] = instr.operands
    return [...epilogBody, X86.Instr("jmp", [target])]
  })
}
