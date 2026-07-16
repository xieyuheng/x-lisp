import type { EncodedInstruction } from "./types.ts"

export function encodeNop(): Array<EncodedInstruction> {
  return [
    {
      prefixes: [],
      rex: null,
      opcode: [0x90],
      modRM: null,
      sib: null,
      displacement: null,
      immediate: null,
    },
  ]
}
