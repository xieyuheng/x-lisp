export function modRM(mod: number, reg: number, rm: number): number {
  return ((mod & 0x03) << 6) | ((reg & 0x07) << 3) | (rm & 0x07)
}

export const MOD_DISP0 = 0
export const MOD_DISP8 = 1
export const MOD_DISP32 = 2
export const MOD_REG = 3
