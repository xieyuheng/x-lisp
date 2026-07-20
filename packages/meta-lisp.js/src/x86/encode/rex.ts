import { regInfo } from "./reg.ts"

export function computeRex(
  w: boolean,
  reg: string | null,
  index: string | null,
  rm: string | null,
): number | null {
  let value = 0x40
  let needed = w
  if (w) value |= 0x08

  if (reg) {
    const r = regInfo(reg)
    if (r.isExtended) {
      value |= 0x04
      needed = true
    }
    if (r.needsRex) {
      needed = true
    }
  }
  if (index) {
    const r = regInfo(index)
    if (r.isExtended) {
      value |= 0x02
      needed = true
    }
    if (r.needsRex) {
      needed = true
    }
  }
  if (rm) {
    const r = regInfo(rm)
    if (r.isExtended) {
      value |= 0x01
      needed = true
    }
    if (r.needsRex) {
      needed = true
    }
  }

  return needed ? value : null
}
