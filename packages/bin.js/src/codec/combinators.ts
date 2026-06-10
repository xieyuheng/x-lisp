import type { Codec, Endian } from "./Codec.ts"

export function structure<Fields extends Record<string, Codec<unknown>>>(
  fields: Fields,
): Codec<{
  [Key in keyof Fields]: Fields[Key] extends Codec<infer T> ? T : never
}> {
  return {
    decode(state) {
      const result: Record<string, unknown> = {}
      for (const key of Object.keys(fields)) {
        result[key] = (fields[key] as Codec<unknown>).decode(state)
      }
      return result as any
    },
    encode(value, state) {
      for (const key of Object.keys(fields)) {
        ;(fields[key] as Codec<unknown>).encode((value as any)[key], state)
      }
    },
  }
}

export function magic(bytes: number[]): Codec<void> {
  return {
    decode(state) {
      for (const expectedByte of bytes) {
        const actualByte = state.getUint8()
        if (actualByte !== expectedByte) {
          throw new Error(
            `[magic] expected 0x${expectedByte.toString(16)} at byte ${state.position.byteIndex - 1} but got 0x${actualByte.toString(16)}`,
          )
        }
      }
    },
    encode(_value, state) {
      for (const byte of bytes) {
        state.setUint8(byte)
      }
    },
  }
}

export function padding(length: number): Codec<void> {
  return {
    decode(state) {
      state.position = {
        byteIndex: state.position.byteIndex + length,
        bitOffset: 0,
      }
    },
    encode(_value, state) {
      for (let index = 0; index < length; index++) {
        state.setUint8(0)
      }
    },
  }
}

export function fixedArray<T>(count: number, element: Codec<T>): Codec<T[]> {
  return {
    decode(state) {
      const result: T[] = []
      for (let index = 0; index < count; index++) {
        result.push(element.decode(state))
      }
      return result
    },
    encode(value, state) {
      for (let index = 0; index < count; index++) {
        element.encode(value[index], state)
      }
    },
  }
}

export function offset<T>(byteIndex: number, inner: Codec<T>): Codec<T> {
  return {
    decode(state) {
      const saved = state.position
      state.position = { byteIndex, bitOffset: 0 }
      const result = inner.decode(state)
      state.position = saved
      return result
    },
    encode(value, state) {
      const saved = state.position
      state.position = { byteIndex, bitOffset: 0 }
      inner.encode(value, state)
      state.position = saved
    },
  }
}

export function endian<T>(endian: Endian, inner: Codec<T>): Codec<T> {
  return {
    decode(state) {
      const saved = state.endian
      state.endian = endian
      const result = inner.decode(state)
      state.endian = saved
      return result
    },
    encode(value, state) {
      const saved = state.endian
      state.endian = endian
      inner.encode(value, state)
      state.endian = saved
    },
  }
}
