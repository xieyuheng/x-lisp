export type Tag =
  | typeof IntTag
  | typeof FloatTag
  | typeof LittleTag
  | typeof AddressTag
  | typeof ObjectTag

export const IntTag = 0b000n
export const FloatTag = 0b001n
export const LittleTag = 0b010n
export const AddressTag = 0b011n
// export const ____ = 0b100n
// export const ____ = 0b101n
// export const ____ = 0b110n
export const ObjectTag = 0b111n
