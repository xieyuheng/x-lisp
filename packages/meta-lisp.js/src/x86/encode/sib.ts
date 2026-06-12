export function sibByte(scale: number, index: number, base: number): number {
  const s = scaleToField(scale)
  return ((s & 0x03) << 6) | ((index & 0x07) << 3) | (base & 0x07)
}

export const SIB_NO_INDEX = 4

function scaleToField(scale: number): number {
  switch (scale) {
    case 1:
      return 0
    case 2:
      return 1
    case 4:
      return 2
    case 8:
      return 3
    default:
      throw new Error(`invalid SIB scale: ${scale}`)
  }
}
