import type { State } from "./State.ts"

export type Endian = "LittleEndian" | "BigEndian"

export type Codec<T> = {
  decode(state: State): T
  encode(value: T, state: State): void
}
