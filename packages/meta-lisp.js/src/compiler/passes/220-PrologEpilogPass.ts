import * as X86 from "../../x86/index.ts"

export function PrologEpilogPass(
  x86Mod: X86.Mod,
  homeMap: Map<string, X86.RegDerefOperand>,
): X86.Mod {
  const newMod: X86.Mod = { definitions: new Map() }

  for (const definition of x86Mod.definitions.values()) {
    if (definition.kind !== "CodeDefinition") {
      newMod.definitions.set(definition.name, definition)
      continue
    }

    const stackSpace = computeStackSpace(definition.instrs, homeMap)

    const newInstrs = prologEpilogDefinition(
      definition.name,
      definition.instrs,
      stackSpace,
    )
    newMod.definitions.set(
      definition.name,
      X86.CodeDefinition(definition.name, newInstrs),
    )
  }

  return newMod
}

function computeStackSpace(
  instrs: Array<X86.Instr>,
  homeMap: Map<string, X86.RegDerefOperand>,
): number {
  let maxAbsOffset = 0n
  for (const instr of instrs) {
    for (const op of instr.operands) {
      if (op.kind === "RegDerefOperand") {
        const disp = op.disp
        if (disp && disp.kind === "IntDisplacement") {
          const v = disp.value < 0n ? -disp.value : disp.value
          if (v > maxAbsOffset) maxAbsOffset = v
        }
      }
    }
  }
  if (maxAbsOffset === 0n) return 0
  return align16(Number(maxAbsOffset))
}

function align16(n: number): number {
  return ((n + 15) >> 4) << 4
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
