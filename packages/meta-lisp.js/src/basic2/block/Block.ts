import { type Instr } from "../instr/index.ts"
import { type Terminator } from "../terminator/index.ts"
import { type Type } from "../type/index.ts"

export type Block = {
  label: string
  parameters: Array<[string, Type]>
  instrs: Array<Instr>
  terminator: Terminator
}

export function Block(
  label: string,
  parameters: Array<[string, Type]>,
  instrs: Array<Instr>,
  terminator: Terminator,
): Block {
  return { label, parameters, instrs, terminator }
}
