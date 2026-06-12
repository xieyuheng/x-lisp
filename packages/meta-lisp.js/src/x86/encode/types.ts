export type EncodedInstruction = {
  prefixes: Array<number>
  rex: number | null
  opcode: Array<number>
  modRM: number | null
  sib: number | null
  displacement: null | { size: 1 | 2 | 4; value: number }
  immediate: null | { size: 1 | 2 | 4 | 8; value: bigint }
}
