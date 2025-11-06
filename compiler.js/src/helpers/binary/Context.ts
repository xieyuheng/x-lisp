export type Context = {
  buffer: ArrayBuffer
  view: DataView
  index: number
  bitOffset: number
  data: any
}

export function createContext(buffer: ArrayBuffer, data: any): Context {
  return {
    buffer,
    view: new DataView(buffer),
    index: 0,
    bitOffset: 0,
    data,
  }
}
