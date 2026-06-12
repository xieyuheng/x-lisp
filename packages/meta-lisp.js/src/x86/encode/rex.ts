import { isExtendedReg } from "./reg.ts"

export function computeRex(
  w: boolean,
  reg: string | null,
  index: string | null,
  rm: string | null,
): number | null {
  let value = 0x40
  if (w) value |= 0x08
  if (reg && isExtendedReg(reg)) value |= 0x04
  if (index && isExtendedReg(index)) value |= 0x02
  if (rm && isExtendedReg(rm)) value |= 0x01
  return value === 0x40 ? null : value
}
