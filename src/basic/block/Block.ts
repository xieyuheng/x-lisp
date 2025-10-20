import type { Instr } from "../instr/index.ts"

export type Block = {
  label: string
  instrs: Array<Instr>
}
