export type TlvEntry = {
  tag: number
  value: Uint8Array
}

export type Tlv = {
  entries: Array<TlvEntry>
}

export function TlvEntry(tag: number, value: Uint8Array): TlvEntry {
  return {
    tag,
    value,
  }
}

export function Tlv(entries: Array<TlvEntry>): Tlv {
  return {
    entries,
  }
}
