import { type Tlv, type TlvEntry } from "./types.ts"

export function encodeTlv(tlv: Tlv): Uint8Array {
  let totalSize = 0
  for (const entry of tlv.entries) {
    totalSize += 5 + entry.value.byteLength
  }

  const bytes = new Uint8Array(totalSize)
  let offset = 0

  for (const entry of tlv.entries) {
    offset = writeTlvEntry(bytes, offset, entry)
  }

  return bytes
}

export function writeTlvEntry(
  bytes: Uint8Array,
  offset: number,
  entry: TlvEntry,
): number {
  if (entry.tag < 0 || entry.tag > 0xff) {
    throw new Error(`[writeTlvEntry] tag out of range: ${entry.tag}`)
  }

  if (entry.value.byteLength > 0xffffffff) {
    throw new Error(
      `[writeTlvEntry] value too large: ${entry.value.byteLength} bytes`,
    )
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)

  view.setUint8(offset, entry.tag)
  view.setUint32(offset + 1, entry.value.byteLength, true)
  bytes.set(entry.value, offset + 5)

  return offset + 5 + entry.value.byteLength
}
