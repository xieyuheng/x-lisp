export type SchemaType =
  | Int8
  | Int16
  | Int32
  | BigInt64
  | Uint8
  | Uint16
  | Uint32
  | BigUint64
  | Float16
  | Float32
  | Float64

export type Int8 = { type: "Int8" }
export const Int8 = (): Int8 => ({ type: "Int8" })

export type Int16 = { type: "Int16" }
export const Int16 = (): Int16 => ({ type: "Int16" })

export type Int32 = { type: "Int32" }
export const Int32 = (): Int32 => ({ type: "Int32" })

export type BigInt64 = { type: "BigInt64" }
export const BigInt64 = (): BigInt64 => ({ type: "BigInt64" })

export type Uint8 = { type: "Uint8" }
export const Uint8 = (): Uint8 => ({ type: "Uint8" })

export type Uint16 = { type: "Uint16" }
export const Uint16 = (): Uint16 => ({ type: "Uint16" })

export type Uint32 = { type: "Uint32" }
export const Uint32 = (): Uint32 => ({ type: "Uint32" })

export type BigUint64 = { type: "BigUint64" }
export const BigUint64 = (): BigUint64 => ({ type: "BigUint64" })

export type Float16 = { type: "Float16" }
export const Float16 = (): Float16 => ({ type: "Float16" })

export type Float32 = { type: "Float32" }
export const Float32 = (): Float32 => ({ type: "Float32" })

export type Float64 = { type: "Float64" }
export const Float64 = (): Float64 => ({ type: "Float64" })
