import { FunctionDefinition } from "../definition/Definition.ts"
import { type Exe, type ExeFunctionDefinition } from "../exe/Exe.ts"
import { type Instr } from "../instr/Instr.ts"
import { makeDisassembleContext } from "./DisassembleContext.ts"
import { disassembleInstr } from "./disassembleInstr.ts"

export function disassembleFunction(
  exe: Exe,
  fn: ExeFunctionDefinition,
): FunctionDefinition {
  const ctx = makeDisassembleContext(exe, fn)
  const parameters = fn.localNames.slice(0, fn.arity)
  const instrs: Array<Instr> = []

  while (ctx.offset < ctx.code.byteLength) {
    instrs.push(...disassembleInstr(ctx))
  }

  return FunctionDefinition(fn.name, parameters, instrs)
}
