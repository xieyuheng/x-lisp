export type State = {
  buffer: ArrayBuffer
  view: DataView
  positionStack: Array<Position>
  endianStack: Array<Endian>
  data: any
}

export type Position = { byteIndex: number; bitOffset: number }
export type Endian = "LittleEndian" | "BigEndian"

export function createState(buffer: ArrayBuffer, data: any): State {
  return {
    buffer,
    view: new DataView(buffer),
    positionStack: [{ byteIndex: 0, bitOffset: 0 }],
    endianStack: ["LittleEndian"],
    data,
  }
}
