import { type Instr } from "../instr/index.ts"
import { type SourceLocation } from "@xieyuheng/sexp.js"

export type Block = {
  label: string
  instrs: Array<Instr>
  location?: SourceLocation
}

export function Block(
  label: string,
  instrs: Array<Instr>,
  location?: SourceLocation,
): Block {
  return {
    label,
    instrs,
    location,
  }
}
