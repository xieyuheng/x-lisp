import type { EncodedInstruction } from "./types.ts"

export function encodedSize(enc: EncodedInstruction): number {
  let n = enc.prefixes.length
  if (enc.rex !== null) n += 1
  n += enc.opcode.length
  if (enc.modRM !== null) n += 1
  if (enc.sib !== null) n += 1
  if (enc.displacement !== null) n += enc.displacement.size
  if (enc.immediate !== null) n += enc.immediate.size
  return n
}

export function emitTo(
  enc: EncodedInstruction,
  buf: Uint8Array,
  offset: number,
): number {
  let pos = offset
  for (const b of enc.prefixes) {
    buf[pos++] = b
  }
  if (enc.rex !== null) {
    buf[pos++] = enc.rex
  }
  for (const b of enc.opcode) {
    buf[pos++] = b
  }
  if (enc.modRM !== null) {
    buf[pos++] = enc.modRM
  }
  if (enc.sib !== null) {
    buf[pos++] = enc.sib
  }
  if (enc.displacement !== null) {
    writeIntLE(buf, pos, enc.displacement.size, BigInt(enc.displacement.value))
    pos += enc.displacement.size
  }
  if (enc.immediate !== null) {
    writeIntLE(buf, pos, enc.immediate.size, enc.immediate.value)
    pos += enc.immediate.size
  }
  return pos
}

function writeIntLE(
  buf: Uint8Array,
  offset: number,
  size: number,
  value: bigint,
): void {
  for (let i = 0; i < size; i++) {
    buf[offset + i] = Number((value >> BigInt(i * 8)) & 0xffn)
  }
}
