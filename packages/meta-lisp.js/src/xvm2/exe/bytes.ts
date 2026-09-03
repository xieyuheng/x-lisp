export function writeU16LE(
  bytes: Uint8Array,
  offset: number,
  value: number,
): number {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  view.setUint16(offset, value, true)
  return offset + 2
}

export function writeU32LE(
  bytes: Uint8Array,
  offset: number,
  value: number,
): number {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  view.setUint32(offset, value, true)
  return offset + 4
}

export function readU16LE(bytes: Uint8Array, offset: number): number {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  return view.getUint16(offset, true)
}

export function readU32LE(bytes: Uint8Array, offset: number): number {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  return view.getUint32(offset, true)
}