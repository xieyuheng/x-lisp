export class WriteBuffer {
  private chunks: Array<Uint8Array> = []
  private size = 0
  private view = new DataView(new ArrayBuffer(8))

  reserve(n: number): number {
    const offset = this.size
    this.size += n
    return offset
  }

  u8(value: number): void {
    const buf = new Uint8Array(1)
    buf[0] = value & 0xff
    this.chunks.push(buf)
    this.size += 1
  }

  u16(value: number): void {
    const buf = new Uint8Array(2)
    this.view.setUint16(0, value, true)
    buf[0] = this.view.getUint8(0)
    buf[1] = this.view.getUint8(1)
    this.chunks.push(buf)
    this.size += 2
  }

  u32(value: number): void {
    const buf = new Uint8Array(4)
    this.view.setUint32(0, value, true)
    buf[0] = this.view.getUint8(0)
    buf[1] = this.view.getUint8(1)
    buf[2] = this.view.getUint8(2)
    buf[3] = this.view.getUint8(3)
    this.chunks.push(buf)
    this.size += 4
  }

  u64(value: bigint): void {
    const buf = new Uint8Array(8)
    this.view.setBigUint64(0, value, true)
    buf[0] = this.view.getUint8(0)
    buf[1] = this.view.getUint8(1)
    buf[2] = this.view.getUint8(2)
    buf[3] = this.view.getUint8(3)
    buf[4] = this.view.getUint8(4)
    buf[5] = this.view.getUint8(5)
    buf[6] = this.view.getUint8(6)
    buf[7] = this.view.getUint8(7)
    this.chunks.push(buf)
    this.size += 8
  }

  i32(value: number): void {
    this.u32(value)
  }

  bytes(buf: Uint8Array): void {
    this.chunks.push(buf)
    this.size += buf.length
  }

  zeros(n: number): void {
    if (n > 0) {
      this.chunks.push(new Uint8Array(n))
      this.size += n
    }
  }

  align(alignment: number): void {
    const rem = this.size % alignment
    if (rem !== 0) {
      this.zeros(alignment - rem)
    }
  }

  toArrayBuffer(): ArrayBuffer {
    const result = new Uint8Array(this.size)
    let offset = 0
    for (const chunk of this.chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }
    return result.buffer
  }

  getSize(): number {
    return this.size
  }
}
