import { instrDest, instrOperands, type Instr } from "../instr/index.ts"

export function formatInstr(instr: Instr): string {
  const dest = instrDest(instr)
  if (dest) {
    const operands = instrOperands(instr).join(" ")
    return `(= ${dest} (${instr.op} ${operands}))`
  } else {
    const operands = instrOperands(instr).join(" ")
    return `(${instr.op} ${operands})`
  }
}
