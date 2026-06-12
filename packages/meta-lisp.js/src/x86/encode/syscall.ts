import type { EncodedInstruction } from "./types.ts"

export function encodeSyscall(): Array<EncodedInstruction> {
  return [
    {
      prefixes: [],
      rex: null,
      opcode: [0x0f, 0x05],
      modRM: null,
      sib: null,
      displacement: null,
      immediate: null,
    },
  ]
}
