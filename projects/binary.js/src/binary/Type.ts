import type { Exp } from "./Exp.ts"

export type Type =
  | Int8
  | Int16
  | Int32
  | Int64
  | BigInt64
  | Uint8
  | Uint16
  | Uint32
  | Uint64
  | BigUint64
  | Float16
  | Float32
  | Float64
  | Array

export type Int8 = { kind: "Int8" }
export const Int8 = (): Int8 => ({ kind: "Int8" })

export type Int16 = { kind: "Int16" }
export const Int16 = (): Int16 => ({ kind: "Int16" })

export type Int32 = { kind: "Int32" }
export const Int32 = (): Int32 => ({ kind: "Int32" })

export type Int64 = { kind: "Int64" }
export const Int64 = (): Int64 => ({ kind: "Int64" })

export type BigInt64 = { kind: "BigInt64" }
export const BigInt64 = (): BigInt64 => ({ kind: "BigInt64" })

export type Uint8 = { kind: "Uint8" }
export const Uint8 = (): Uint8 => ({ kind: "Uint8" })

export type Uint16 = { kind: "Uint16" }
export const Uint16 = (): Uint16 => ({ kind: "Uint16" })

export type Uint32 = { kind: "Uint32" }
export const Uint32 = (): Uint32 => ({ kind: "Uint32" })

export type Uint64 = { kind: "Uint64" }
export const Uint64 = (): Uint64 => ({ kind: "Uint64" })

export type BigUint64 = { kind: "BigUint64" }
export const BigUint64 = (): BigUint64 => ({ kind: "BigUint64" })

export type Float16 = { kind: "Float16" }
export const Float16 = (): Float16 => ({ kind: "Float16" })

export type Float32 = { kind: "Float32" }
export const Float32 = (): Float32 => ({ kind: "Float32" })

export type Float64 = { kind: "Float64" }
export const Float64 = (): Float64 => ({ kind: "Float64" })

export type Array = {
  kind: "Array"
  elementCount: number
  elementSize: number
  exp: Exp
}

export const Array = (
  elementCount: number,
  elementSize: number,
  exp: Exp,
): Array => ({
  kind: "Array",
  elementCount,
  elementSize,
  exp,
})
