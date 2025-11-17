export type Tag =
  | 0b000
  | 0b001
  | 0b010
  | 0b011
  | 0b100
  | 0b101
  | 0b110
  | 0b111

export const IntTag = 0b000
export const FloatTag = 0b001
export const LittleTag = 0b010
export const AddressTag = 0b011
// export const ____        = 0b100
// export const ____        = 0b101
// export const ____        = 0b110
export const ObjectTag = 0b111
