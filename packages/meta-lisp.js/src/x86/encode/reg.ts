type RegInfo = {
  code: number
  isExtended: boolean
  needsRex: boolean
}

function r(
  name: string,
  code: number,
  isExtended: boolean,
  needsRex?: boolean,
): [string, RegInfo] {
  return [name, { code, isExtended, needsRex: needsRex ?? false }]
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
  r("eax", 0, false), r("ecx", 1, false), r("edx", 2, false), r("ebx", 3, false),
  r("esp", 4, false), r("ebp", 5, false), r("esi", 6, false), r("edi", 7, false),
  // 32-bit extended
  r("r8d",  0, true), r("r9d",  1, true), r("r10d", 2, true), r("r11d", 3, true),
  r("r12d", 4, true), r("r13d", 5, true), r("r14d", 6, true), r("r15d", 7, true),

  // 16-bit low
  r("ax", 0, false), r("cx", 1, false), r("dx", 2, false), r("bx", 3, false),
  r("sp", 4, false), r("bp", 5, false), r("si", 6, false), r("di", 7, false),
  // 16-bit extended
  r("r8w",  0, true), r("r9w",  1, true), r("r10w", 2, true), r("r11w", 3, true),
  r("r12w", 4, true), r("r13w", 5, true), r("r14w", 6, true), r("r15w", 7, true),

  // 8-bit low
  r("al", 0, false), r("cl", 1, false), r("dl", 2, false), r("bl", 3, false),
  // 8-bit REX-only (need bare REX=0x40 prefix)
  r("spl", 4, false, true), r("bpl", 5, false, true), r("sil", 6, false, true), r("dil", 7, false, true),
  // 8-bit extended
  r("r8b",  0, true), r("r9b",  1, true), r("r10b", 2, true), r("r11b", 3, true),
  r("r12b", 4, true), r("r13b", 5, true), r("r14b", 6, true), r("r15b", 7, true),
  // 8-bit high legacy (incompatible with REX)
  r("ah", 4, false), r("ch", 5, false), r("dh", 6, false), r("bh", 7, false),
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
