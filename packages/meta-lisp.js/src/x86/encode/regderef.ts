import type { RegDerefOperand } from "../operand/index.ts"
import { regCode, isExtendedReg } from "./reg.ts"
import { modRM, MOD_DISP0, MOD_DISP8, MOD_DISP32 } from "./modrm.ts"
import { sibByte, SIB_NO_INDEX } from "./sib.ts"

export type RegDerefEncoding = {
  modrm: { codeForReg: (reg: number) => number; codeForOpExt: (ext: number) => number }
  sib: number | null
  disp: { size: 1 | 2 | 4; value: number } | null
  rexRm: string
  rexIndex: string | null
}

export function encodeRegDeref(op: RegDerefOperand): RegDerefEncoding {
  const base = op.base
  const index = op.index
  const scale = op.scale ? Number(op.scale) : 0
  const disp = op.disp ? Number(op.disp) : 0

  if (index) {
    return encodeWithIndex(base, index, scale, disp)
  }

  return encodeWithoutIndex(base, disp)
}

function encodeWithIndex(
  base: string,
  index: string,
  scale: number,
  disp: number,
): RegDerefEncoding {
  const { mod, dispEnc } = computeDisp(disp)
  if (mod === MOD_DISP0 && (base === "rbp" || base === "r13")) {
    const d = { size: 1 as const, value: 0 }
    return makeResult(MOD_DISP8, base, index, scale, d)
  }
  return makeResult(mod, base, index, scale, dispEnc)
}

function encodeWithoutIndex(
  base: string,
  disp: number,
): RegDerefEncoding {
  const { mod, dispEnc } = computeDisp(disp)

  if (mod === MOD_DISP0) {
    if (base === "rbp" || base === "r13") {
      return makeResultNoIndex(MOD_DISP8, base, { size: 1, value: 0 })
    }
    return makeResultNoIndex(MOD_DISP0, base, null)
  }

  return makeResultNoIndex(mod, base, dispEnc)
}

function computeDisp(disp: number): {
  mod: number
  dispEnc: { size: 1 | 2 | 4; value: number } | null
} {
  if (disp === 0) {
    return { mod: MOD_DISP0, dispEnc: null }
  }
  if (disp >= -128 && disp <= 127) {
    return { mod: MOD_DISP8, dispEnc: { size: 1, value: disp } }
  }
  return { mod: MOD_DISP32, dispEnc: { size: 4, value: disp } }
}

function makeResult(
  mod: number,
  base: string,
  index: string,
  scale: number,
  dispEnc: { size: 1 | 2 | 4; value: number } | null,
): RegDerefEncoding {
  const sib = sibByte(scale, regCode(index), regCode(base))
  const rm = 4
  return {
    modrm: {
      codeForReg: (reg: number) => modRM(mod, reg, rm),
      codeForOpExt: (ext: number) => modRM(mod, ext, rm),
    },
    sib,
    disp: dispEnc,
    rexRm: base,
    rexIndex: index,
  }
}

function makeResultNoIndex(
  mod: number,
  base: string,
  dispEnc: { size: 1 | 2 | 4; value: number } | null,
): RegDerefEncoding {
  return {
    modrm: {
      codeForReg: (reg: number) => modRM(mod, reg, regCode(base)),
      codeForOpExt: (ext: number) => modRM(mod, ext, regCode(base)),
    },
    sib: null,
    disp: dispEnc,
    rexRm: base,
    rexIndex: null,
  }
}
