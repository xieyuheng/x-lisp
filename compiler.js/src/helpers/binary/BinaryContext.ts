export type BinaryContext = {
  buffer: ArrayBuffer
  view: DataView
  index: number
  bitOffset: number
  data: any
}

export function createBinaryContext(
  buffer: ArrayBuffer,
  data: any,
): BinaryContext {
  return {
    buffer,
    view: new DataView(buffer),
    index: 0,
    bitOffset: 0,
    data,
  }
}
