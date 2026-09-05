export function tagInt(value: bigint): bigint {
  return value << 3n
}

export function untagInt(value: bigint): bigint {
  return BigInt.asIntN(64, value) >> 3n
}

export function tagFloat(value: number): bigint {
  const bytes = new Uint8Array(8)
  const view = new DataView(bytes.buffer)
  view.setFloat64(0, value, true)

  return (view.getBigUint64(0, true) & 0xfffffffffffffff8n) | 1n
}

export function untagFloat(value: bigint): number {
  const bytes = new Uint8Array(8)
  const view = new DataView(bytes.buffer)
  view.setBigUint64(0, value & 0xfffffffffffffff8n, true)
  return view.getFloat64(0, true)
}
