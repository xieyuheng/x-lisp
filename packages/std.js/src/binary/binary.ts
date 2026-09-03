export function writeU8LE(
  bytes: Uint8Array,
  offset: number,
  value: number,
): number {
  bytes[offset] = value
  return offset + 1
}

export function writeU16LE(
  bytes: Uint8Array,
  offset: number,
  value: number,
): number {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  view.setUint16(offset, value, true)
  return offset + 2
}

export function writeU64LE(
  bytes: Uint8Array,
  offset: number,
  value: bigint,
): number {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  view.setBigUint64(offset, value, true)
  return offset + 8
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

export function writeI32LE(
  bytes: Uint8Array,
  offset: number,
  value: number,
): number {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  view.setInt32(offset, value, true)
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