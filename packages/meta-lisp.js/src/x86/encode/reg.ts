const REG_CODES: Record<string, number> = {
  rax: 0,
  rcx: 1,
  rdx: 2,
  rbx: 3,
  rsp: 4,
  rbp: 5,
  rsi: 6,
  rdi: 7,
  r8: 0,
  r9: 1,
  r10: 2,
  r11: 3,
  r12: 4,
  r13: 5,
  r14: 6,
  r15: 7,
}

export function regCode(name: string): number {
  const code = REG_CODES[name]
  if (code === undefined) throw new Error(`unknown register: ${name}`)
  return code
}

export function isExtendedReg(name: string): boolean {
  const m = name.match(/^r(\d+)$/)
  if (m) return parseInt(m[1]) >= 8
  return false
}
