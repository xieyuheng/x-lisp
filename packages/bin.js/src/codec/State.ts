import type { Endian } from "./Codec.ts"
import type { Position } from "./Position.ts"

export class State {
  buffer: ArrayBuffer
  view: DataView
  position: Position
  endian: Endian

  constructor(buffer: ArrayBuffer, endian: Endian) {
    this.buffer = buffer
    this.view = new DataView(buffer)
    this.position = { byteIndex: 0, bitOffset: 0 }
    this.endian = endian
  }

  isLittleEndian(): boolean {
    return this.endian === "LittleEndian"
  }

  getUint8(): number {
    const value = this.view.getUint8(this.position.byteIndex)
    this.position.byteIndex += 1
    return value
  }

  getUint16(): number {
    const value = this.view.getUint16(
      this.position.byteIndex,
      this.isLittleEndian(),
    )
    this.position.byteIndex += 2
    return value
  }

  getUint32(): number {
    const value = this.view.getUint32(
      this.position.byteIndex,
      this.isLittleEndian(),
    )
    this.position.byteIndex += 4
    return value
  }

  getBigUint64(): bigint {
    const value = this.view.getBigUint64(
      this.position.byteIndex,
      this.isLittleEndian(),
    )
    this.position.byteIndex += 8
    return value
  }

  getInt8(): number {
    const value = this.view.getInt8(this.position.byteIndex)
    this.position.byteIndex += 1
    return value
  }

  getInt16(): number {
    const value = this.view.getInt16(
      this.position.byteIndex,
      this.isLittleEndian(),
    )
    this.position.byteIndex += 2
    return value
  }

  getInt32(): number {
    const value = this.view.getInt32(
      this.position.byteIndex,
      this.isLittleEndian(),
    )
    this.position.byteIndex += 4
    return value
  }

  getBigInt64(): bigint {
    const value = this.view.getBigInt64(
      this.position.byteIndex,
      this.isLittleEndian(),
    )
    this.position.byteIndex += 8
    return value
  }

  getFloat32(): number {
    const value = this.view.getFloat32(
      this.position.byteIndex,
      this.isLittleEndian(),
    )
    this.position.byteIndex += 4
    return value
  }

  getFloat64(): number {
    const value = this.view.getFloat64(
      this.position.byteIndex,
      this.isLittleEndian(),
    )
    this.position.byteIndex += 8
    return value
  }

  setUint8(value: number): void {
    this.view.setUint8(this.position.byteIndex, value)
    this.position.byteIndex += 1
  }

  setUint16(value: number): void {
    this.view.setUint16(this.position.byteIndex, value, this.isLittleEndian())
    this.position.byteIndex += 2
  }

  setUint32(value: number): void {
    this.view.setUint32(this.position.byteIndex, value, this.isLittleEndian())
    this.position.byteIndex += 4
  }

  setBigUint64(value: bigint): void {
    this.view.setBigUint64(
      this.position.byteIndex,
      value,
      this.isLittleEndian(),
    )
    this.position.byteIndex += 8
  }

  setInt8(value: number): void {
    this.view.setInt8(this.position.byteIndex, value)
    this.position.byteIndex += 1
  }

  setInt16(value: number): void {
    this.view.setInt16(this.position.byteIndex, value, this.isLittleEndian())
    this.position.byteIndex += 2
  }

  setInt32(value: number): void {
    this.view.setInt32(this.position.byteIndex, value, this.isLittleEndian())
    this.position.byteIndex += 4
  }

  setBigInt64(value: bigint): void {
    this.view.setBigInt64(this.position.byteIndex, value, this.isLittleEndian())
    this.position.byteIndex += 8
  }

  setFloat32(value: number): void {
    this.view.setFloat32(this.position.byteIndex, value, this.isLittleEndian())
    this.position.byteIndex += 4
  }

  setFloat64(value: number): void {
    this.view.setFloat64(this.position.byteIndex, value, this.isLittleEndian())
    this.position.byteIndex += 8
  }
}
