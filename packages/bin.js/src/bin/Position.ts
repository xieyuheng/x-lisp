export class Position {
  byteIndex: number
  bitOffset: number

  constructor(byteIndex?: number, bitOffset?: number) {
    this.byteIndex = byteIndex || 0
    this.bitOffset = bitOffset || 0
  }

  advance(byteCount: number): void {
    this.byteIndex += byteCount
    this.bitOffset = 0
  }
}
