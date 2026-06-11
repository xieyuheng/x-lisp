import { type SourceLocation } from "@xieyuheng/sexp.js"
import type { Instr } from "../instr/index.ts"

export type Block = {
  name: string
  instrs: Array<Instr>
  location: SourceLocation
}

export function Block(
  name: string,
  instrs: Array<Instr>,
  location: SourceLocation,
): Block {
  return {
    name,
    instrs,
    location,
  }
}
