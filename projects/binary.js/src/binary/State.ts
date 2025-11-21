import assert from "node:assert"
import { Position } from "./Position.ts"

export type Endian = "LittleEndian" | "BigEndian"

export type Data = Record<string, any>

export class State {
  buffer: ArrayBuffer
  view: DataView
  positionStack: Array<Position>
  endianStack: Array<Endian>
  data: Data

  constructor(buffer: ArrayBuffer, view: DataView, data: Data) {
    this.buffer = buffer
    this.view = view
    this.positionStack = [new Position()]
    this.endianStack = ["LittleEndian"]
    this.data = data
  }

  currentEndian(): Endian {
    const endian = this.endianStack.at(-1)
    assert(endian)
    return endian
  }

  isLittleEndian(): boolean {
    const endian = this.currentEndian()
    return endian === "LittleEndian"
  }

  currentPosition(): Position {
    const position = this.positionStack.at(-1)
    assert(position)
    return position
  }

  getInt8(): number {
    const position = this.currentPosition()
    const value = this.view.getInt8(position.byteIndex)
    position.advance(1)
    return value
  }

  getInt16(): number {
    const position = this.currentPosition()
    const value = this.view.getInt16(position.byteIndex, this.isLittleEndian())
    position.advance(2)
    return value
  }

  getInt32(): number {
    const position = this.currentPosition()
    const value = this.view.getInt32(position.byteIndex, this.isLittleEndian())
    position.advance(4)
    return value
  }

  getBigInt64(): bigint {
    const position = this.currentPosition()
    const value = this.view.getBigInt64(
      position.byteIndex,
      this.isLittleEndian(),
    )
    position.advance(8)
    return value
  }

  getInt64(): number {
    const position = this.currentPosition()
    const value = this.view.getBigInt64(
      position.byteIndex,
      this.isLittleEndian(),
    )
    if (Number.MIN_SAFE_INTEGER <= value && value <= Number.MAX_SAFE_INTEGER) {
      position.advance(8)
      return Number(value)
    }

    let message = `[State.getInt64] bigint out of range`
    message += `\n  value: ${value}`
    throw new Error(message)
  }

  getUint8(): number {
    const position = this.currentPosition()
    const value = this.view.getUint8(position.byteIndex)
    position.advance(1)
    return value
  }

  getUint16(): number {
    const position = this.currentPosition()
    const value = this.view.getUint16(position.byteIndex, this.isLittleEndian())
    position.advance(2)
    return value
  }

  getUint32(): number {
    const position = this.currentPosition()
    const value = this.view.getUint32(position.byteIndex, this.isLittleEndian())
    position.advance(4)
    return value
  }

  getBigUint64(): bigint {
    const position = this.currentPosition()
    const value = this.view.getBigUint64(
      position.byteIndex,
      this.isLittleEndian(),
    )
    position.advance(8)
    return value
  }

  getUint64(): number {
    const position = this.currentPosition()
    const value = this.view.getBigUint64(
      position.byteIndex,
      this.isLittleEndian(),
    )
    if (value <= Number.MAX_SAFE_INTEGER) {
      position.advance(8)
      return Number(value)
    }

    let message = `[State.getUint64] bigint out of range`
    message += `\n  value: ${value}`
    throw new Error(message)
  }

  getFloat16(): number {
    const position = this.currentPosition()
    const value = this.view.getFloat16(
      position.byteIndex,
      this.isLittleEndian(),
    )
    position.advance(2)
    return value
  }

  getFloat32(): number {
    const position = this.currentPosition()
    const value = this.view.getFloat32(
      position.byteIndex,
      this.isLittleEndian(),
    )
    position.advance(4)
    return value
  }

  getFloat64(): number {
    const position = this.currentPosition()
    const value = this.view.getFloat64(
      position.byteIndex,
      this.isLittleEndian(),
    )
    position.advance(8)
    return value
  }
}
