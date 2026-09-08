type RegInfo = {
  code: number
  isExtended: boolean
  needsRex: boolean
  size: 1 | 2 | 4 | 8
}

function r(
  name: string,
  code: number,
  isExtended: boolean,
  needsRex?: boolean,
  size?: 1 | 2 | 4 | 8,
): [string, RegInfo] {
  return [
    name,
    {
      code,
      isExtended,
      needsRex: needsRex ?? false,
      size: size ?? 8,
    },
  ]
}

// prettier-ignore
const REG_TABLE: Record<string, RegInfo> = Object.fromEntries([
  // 64-bit low
  r("rax", 0, false), r("rcx", 1, false), r("rdx", 2, false), r("rbx", 3, false),
  r("rsp", 4, false), r("rbp", 5, false), r("rsi", 6, false), r("rdi", 7, false),
  // 64-bit extended
  r("r8",  0, true),  r("r9",  1, true),  r("r10", 2, true),  r("r11", 3, true),
  r("r12", 4, true),  r("r13", 5, true),  r("r14", 6, true),  r("r15", 7, true),

  // 32-bit low
  r("eax", 0, false, undefined, 4), r("ecx", 1, false, undefined, 4), r("edx", 2, false, undefined, 4), r("ebx", 3, false, undefined, 4),
  r("esp", 4, false, undefined, 4), r("ebp", 5, false, undefined, 4), r("esi", 6, false, undefined, 4), r("edi", 7, false, undefined, 4),
  // 32-bit extended
  r("r8d",  0, true, undefined, 4), r("r9d",  1, true, undefined, 4), r("r10d", 2, true, undefined, 4), r("r11d", 3, true, undefined, 4),
  r("r12d", 4, true, undefined, 4), r("r13d", 5, true, undefined, 4), r("r14d", 6, true, undefined, 4), r("r15d", 7, true, undefined, 4),

  // 16-bit low
  r("ax", 0, false, undefined, 2), r("cx", 1, false, undefined, 2), r("dx", 2, false, undefined, 2), r("bx", 3, false, undefined, 2),
  r("sp", 4, false, undefined, 2), r("bp", 5, false, undefined, 2), r("si", 6, false, undefined, 2), r("di", 7, false, undefined, 2),
  // 16-bit extended
  r("r8w",  0, true, undefined, 2), r("r9w",  1, true, undefined, 2), r("r10w", 2, true, undefined, 2), r("r11w", 3, true, undefined, 2),
  r("r12w", 4, true, undefined, 2), r("r13w", 5, true, undefined, 2), r("r14w", 6, true, undefined, 2), r("r15w", 7, true, undefined, 2),

  // 8-bit low
  r("al", 0, false, undefined, 1), r("cl", 1, false, undefined, 1), r("dl", 2, false, undefined, 1), r("bl", 3, false, undefined, 1),
  // 8-bit REX-only (need bare REX=0x40 prefix)
  r("spl", 4, false, true, 1), r("bpl", 5, false, true, 1), r("sil", 6, false, true, 1), r("dil", 7, false, true, 1),
  // 8-bit extended
  r("r8b",  0, true, undefined, 1), r("r9b",  1, true, undefined, 1), r("r10b", 2, true, undefined, 1), r("r11b", 3, true, undefined, 1),
  r("r12b", 4, true, undefined, 1), r("r13b", 5, true, undefined, 1), r("r14b", 6, true, undefined, 1), r("r15b", 7, true, undefined, 1),
  // 8-bit high legacy (incompatible with REX)
  r("ah", 4, false, undefined, 1), r("ch", 5, false, undefined, 1), r("dh", 6, false, undefined, 1), r("bh", 7, false, undefined, 1),
])

export function regCode(name: string): number {
  const info = REG_TABLE[name]
  if (!info) throw new Error(`unknown register: ${name}`)
  return info.code
}

export function isExtendedReg(name: string): boolean {
  const info = REG_TABLE[name]
  if (!info) throw new Error(`unknown register: ${name}`)
  return info.isExtended
}

export function regInfo(name: string): RegInfo {
  const info = REG_TABLE[name]
  if (!info) throw new Error(`unknown register: ${name}`)
  return info
}

export function regSize(name: string): 1 | 2 | 4 | 8 {
  return regInfo(name).size
}
