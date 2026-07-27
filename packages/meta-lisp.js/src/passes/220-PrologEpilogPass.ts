import * as X86 from "../x86/index.ts"

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

    const stackSpace = computeStackSpace(definition.blocks, homeMap)

    const newBlocks = prologEpilogDefinition(
      definition.name,
      definition.blocks,
      stackSpace,
    )
    newMod.definitions.set(
      definition.name,
      X86.CodeDefinition(definition.name, newBlocks),
    )
  }

  return newMod
}

function computeStackSpace(
  blocks: Array<X86.Block>,
  homeMap: Map<string, X86.RegDerefOperand>,
): number {
  let maxAbsOffset = 0n
  for (const block of blocks) {
    for (const instr of block.instrs) {
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
  }
  if (maxAbsOffset === 0n) return 0
  return align16(Number(maxAbsOffset))
}

function align16(n: number): number {
  return ((n + 15) >> 4) << 4
}

function prologEpilogDefinition(
  funcName: string,
  blocks: Array<X86.Block>,
  stackSpace: number,
): Array<X86.Block> {
  const withTailJmpExpanded = blocks.map((block) =>
    expandTailJmp(block, stackSpace),
  )

  const idx = withTailJmpExpanded.findIndex((b) => b.label === "body")
  if (idx === -1) return withTailJmpExpanded

  const beginBlock = withTailJmpExpanded[idx]

  const bodyInstrs = beginBlock.instrs.map((instr) => {
    if (instr.op === "ret") {
      return X86.Instr("jmp", [X86.LabelOperand("epilog")])
    }
    return instr
  })

  const epilogBody = makeEpilogBody(stackSpace)

  const prologBlock = X86.Block("body", [
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
    ...(bodyInstrs.length > 0
      ? [X86.Instr("jmp", [X86.LabelOperand("body.body")])]
      : []),
  ])

  const bodyBlock = X86.Block("body.body", bodyInstrs)

  const epilogBlock = X86.Block("epilog", [...epilogBody, X86.Instr("ret", [])])

  const result = [...withTailJmpExpanded]
  result.splice(idx, 1, prologBlock, bodyBlock, epilogBlock)
  return result
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

function expandTailJmp(block: X86.Block, stackSpace: number): X86.Block {
  const epilogBody = makeEpilogBody(stackSpace)
  const instrs = block.instrs.flatMap((instr) => {
    if (instr.op !== "tail-jmp") return [instr]
    const [target] = instr.operands
    return [...epilogBody, X86.Instr("jmp", [target])]
  })
  return X86.Block(block.label, instrs)
}
