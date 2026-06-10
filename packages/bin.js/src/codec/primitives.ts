import type { Codec } from "./Codec.ts"
import type { State } from "./State.ts"

function primitive<T>(
  decode: (state: State) => T,
  encode: (value: T, state: State) => void,
): Codec<T> {
  return { decode, encode }
}

export const uint8: Codec<number> = primitive(
  (state) => state.getUint8(),
  (value, state) => state.setUint8(value),
)

export const uint16: Codec<number> = primitive(
  (state) => state.getUint16(),
  (value, state) => state.setUint16(value),
)

export const uint32: Codec<number> = primitive(
  (state) => state.getUint32(),
  (value, state) => state.setUint32(value),
)

export const uint64: Codec<bigint> = primitive(
  (state) => state.getBigUint64(),
  (value, state) => state.setBigUint64(value),
)

export const int8: Codec<number> = primitive(
  (state) => state.getInt8(),
  (value, state) => state.setInt8(value),
)

export const int16: Codec<number> = primitive(
  (state) => state.getInt16(),
  (value, state) => state.setInt16(value),
)

export const int32: Codec<number> = primitive(
  (state) => state.getInt32(),
  (value, state) => state.setInt32(value),
)

export const int64: Codec<bigint> = primitive(
  (state) => state.getBigInt64(),
  (value, state) => state.setBigInt64(value),
)

export const float32: Codec<number> = primitive(
  (state) => state.getFloat32(),
  (value, state) => state.setFloat32(value),
)

export const float64: Codec<number> = primitive(
  (state) => state.getFloat64(),
  (value, state) => state.setFloat64(value),
)
