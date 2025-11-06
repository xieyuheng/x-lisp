export type State = {
  buffer: ArrayBuffer
  view: DataView
  index: number
  bitOffset: number
  data: any
}

export function createState(buffer: ArrayBuffer, data: any): State {
  return {
    buffer,
    view: new DataView(buffer),
    index: 0,
    bitOffset: 0,
    data,
  }
}
