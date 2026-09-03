import { Tlv, TlvEntry } from "./types.ts"

export function decodeTlv(bytes: Uint8Array): Tlv {
  const entries: Array<TlvEntry> = []
  let offset = 0

  while (offset < bytes.byteLength) {
    const { entry, nextOffset } = readTlvEntry(bytes, offset)
    entries.push(entry)
    offset = nextOffset
  }

  return Tlv(entries)
}

export type ReadTlvEntryResult = {
  entry: TlvEntry
  nextOffset: number
}

export function readTlvEntry(
  bytes: Uint8Array,
  offset: number,
): ReadTlvEntryResult {
  if (bytes.byteLength - offset < 5) {
    throw new Error("[readTlvEntry] truncated TLV header")
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const tag = view.getUint8(offset)
  const length = view.getUint32(offset + 1, true)
  const valueOffset = offset + 5

  if (valueOffset + length > bytes.byteLength) {
    throw new Error("[readTlvEntry] truncated TLV value")
  }

  return {
    entry: TlvEntry(tag, bytes.slice(valueOffset, valueOffset + length)),
    nextOffset: valueOffset + length,
  }
}
