const REG_CODES: Record<string, number> = {
  rax: 0, rcx: 1, rdx: 2, rbx: 3,
  rsp: 4, rbp: 5, rsi: 6, rdi: 7,
  r8: 8, r9: 9, r10: 10, r11: 11,
  r12: 12, r13: 13, r14: 14, r15: 15,
}

function regCode(name: string): number {
  const c = REG_CODES[name]
  if (c === undefined) throw new Error(`unknown register: ${name}`)
  return c
}

function rex(w: boolean, r: boolean, x: boolean, b: boolean): number {
  return 0x40 | (w ? 0x08 : 0) | (r ? 0x04 : 0) | (x ? 0x02 : 0) | (b ? 0x01 : 0)
}

export type RegInfo = {
  name: string
}

export type ImmInfo = {
  value: bigint
}

export type MemInfo = {
  base?: RegInfo
  index?: RegInfo
  scale?: number
  disp?: number
}

export type LabelReloc = {
  name: string
  path: Array<string>
  /** additional field offset */
  addend: number
}

export type RelocEntry = {
  offset: number
  kind: "ABS64" | "REL32"
  label: LabelReloc
}

export type EncodedOp = {
  bytes: number[]
  relocs: RelocEntry[]
}

type Mode = "reg" | "mem" | "imm" | "label-imm" | "label-deref"

function classify(op: any): Mode {
  switch (op.kind) {
    case "RegOperand": return "reg"
    case "ImmOperand": return "imm"
    case "RegDerefOperand": return "mem"
    case "LabelDerefOperand": return "label-deref"
    case "LabelImmOperand": return "label-imm"
    default: throw new Error(`unexpected operand: ${op.kind}`)
  }
}

function modrm(mod: number, regOp: number, rm: number): number {
  return ((mod & 3) << 6) | ((regOp & 7) << 3) | (rm & 7)
}

function sib(scale: number, index: number, base: number): number {
  return ((scale & 3) << 6) | ((index & 7) << 3) | (base & 7)
}

function fits8(n: bigint): boolean {
  return n >= -128n && n <= 127n
}

function fits32(n: bigint): boolean {
  return n >= -2147483648n && n <= 2147483647n
}

function highReg(code: number): boolean {
  return code >= 8
}

// ----- memory operand encoding (for RegDerefOperand / LabelDerefOperand) -----

function encodeMemModrm(
  baseReg?: string,
  indexReg?: string,
  scale?: number,
  disp?: bigint,
): { rex: number; modrm: number; sib: number | null; dispBytes: number[] } {
  let rexB = false
  let rexX = false

  const hasIndex = indexReg !== undefined
  const hasBase = baseReg !== undefined
  const hasDisp = disp !== undefined && disp !== 0n

  let mod = 0
  let rm = 0
  let sibByte: number | null = null
  const dispBytes: number[] = []

  if (hasIndex) {
    const idxCode = regCode(indexReg!)
    if (highReg(idxCode)) rexB = true
    const sibScale: number = scale === 8 ? 3 : scale === 4 ? 2 : scale === 2 ? 1 : 0

    if (hasBase) {
      const baseCode = regCode(baseReg!)
      if (highReg(baseCode)) rexX = true
      rm = 4
      sibByte = sib(sibScale, idxCode & 7, baseCode & 7)
      if (hasDisp) {
        if (fits8(disp!)) {
          mod = 1
          dispBytes.push(Number(disp!))
        } else {
          mod = 2
          writeI32(dispBytes, Number(disp!))
        }
      } else {
        mod = 0
      }
    } else {
      rm = 4
      mod = 0
      sibByte = sib(sibScale, idxCode & 7, 5)
      dispBytes.push(0, 0, 0, 0)
    }
  } else if (hasBase) {
    const baseCode = regCode(baseReg!)
    if (highReg(baseCode)) rexB = true
    rm = baseCode & 7
    if (hasDisp) {
      if (fits8(disp!)) {
        mod = 1
        dispBytes.push(Number(disp!))
      } else {
        mod = 2
        writeI32(dispBytes, Number(disp!))
      }
    } else {
      if (rm === 5) {
        mod = 1
        dispBytes.push(0)
      } else {
        mod = 0
      }
    }
  } else {
    mod = 0
    rm = 4
    sibByte = sib(0, 4, 5)
    dispBytes.push(0, 0, 0, 0)
  }

  const rexVal = rex(true, false, rexX, rexB)
  return { rex: rexVal, modrm: modrm(mod, 0, rm), sib: sibByte, dispBytes }
}

function writeI32(buf: number[], value: number): void {
  const dv = new DataView(new ArrayBuffer(4))
  dv.setInt32(0, value, true)
  for (let i = 0; i < 4; i++) buf.push(dv.getUint8(i))
}

// ===== INSTRUCTION ENCODERS =====

export function encodeMov(dst: any, src: any): EncodedOp {
  const d = classify(dst)
  const s = classify(src)

  if (d === "reg" && s === "reg") {
    const rc = regCode(dst.name)
    const rs = regCode(src.name)
    const rByte = rex(true, highReg(rc), false, highReg(rs))
    return { bytes: [rByte, 0x8b, modrm(3, rc & 7, rs & 7)], relocs: [] }
  }

  if (d === "reg" && s === "imm") {
    const rc = regCode(dst.name)
    const rByte = rex(true, false, false, highReg(rc))
    const imm = src.value
    if (fits32(imm)) {
      return { bytes: [rByte, 0xc7, modrm(3, 0, rc & 7), Number(imm) & 0xff, (Number(imm) >> 8) & 0xff, (Number(imm) >> 16) & 0xff, (Number(imm) >> 24) & 0xff], relocs: [] }
    }
    const bytes = [rByte, 0xb8 | (rc & 7)]
    writeImm64(bytes, imm)
    return { bytes, relocs: [] }
  }

  if (d === "reg" && s === "mem") {
    return encodeMemToReg(dst, src, 0x8b)
  }

  if (d === "mem" && s === "reg") {
    return encodeRegToMem(dst, src, 0x89)
  }

  if (d === "mem" && s === "imm") {
    return encodeImmToMem(dst, src)
  }

  if (d === "reg" && s === "label-imm") {
    const rc = regCode(dst.name)
    const rByte = rex(true, false, false, highReg(rc))
    const bytes = [rByte, 0xb8 | (rc & 7), 0, 0, 0, 0, 0, 0, 0, 0]
    const reloc: RelocEntry = { offset: 2, kind: "ABS64", label: toLabelReloc(src) }
    return { bytes, relocs: [reloc] }
  }

  if (d === "reg" && s === "label-deref") {
    return encodeLabelDerefToReg(dst, src, 0x8b)
  }

  throw new Error(`unsupported mov: ${d} ← ${s}`)
}

export function encodeAdd(dst: any, src: any): EncodedOp {
  const d = classify(dst)
  const s = classify(src)
  if (d === "reg" && s === "reg") {
    const rc = regCode(dst.name)
    const rs = regCode(src.name)
    const rByte = rex(true, highReg(rc), false, highReg(rs))
    return { bytes: [rByte, 0x03, modrm(3, rc & 7, rs & 7)], relocs: [] }
  }
  if (d === "reg" && s === "imm") {
    return encodeAluImm(dst, src, 0)
  }
  throw new Error(`unsupported add: ${d} ${s}`)
}

export function encodeSub(dst: any, src: any): EncodedOp {
  const d = classify(dst)
  const s = classify(src)
  if (d === "reg" && s === "reg") {
    const rc = regCode(dst.name)
    const rs = regCode(src.name)
    const rByte = rex(true, highReg(rc), false, highReg(rs))
    return { bytes: [rByte, 0x2b, modrm(3, rc & 7, rs & 7)], relocs: [] }
  }
  if (d === "reg" && s === "imm") {
    return encodeAluImm(dst, src, 5)
  }
  throw new Error(`unsupported sub: ${d} ${s}`)
}

export function encodeCmp(dst: any, src: any): EncodedOp {
  const d = classify(dst)
  const s = classify(src)
  if (d === "reg" && s === "reg") {
    const rc = regCode(dst.name)
    const rs = regCode(src.name)
    const rByte = rex(true, highReg(rc), false, highReg(rs))
    return { bytes: [rByte, 0x3b, modrm(3, rc & 7, rs & 7)], relocs: [] }
  }
  if (d === "reg" && s === "imm") {
    return encodeAluImm(dst, src, 7)
  }
  throw new Error(`unsupported cmp: ${d} ${s}`)
}

export function encodeImul(dst: any, src: any): EncodedOp {
  const rc = regCode(dst.name)
  const rs = regCode(src.name)
  const rByte = rex(true, highReg(rc), false, highReg(rs))
  return { bytes: [rByte, 0x0f, 0xaf, modrm(3, rc & 7, rs & 7)], relocs: [] }
}

export function encodeAnd(dst: any, src: any): EncodedOp {
  const d = classify(dst)
  const s = classify(src)
  if (d === "reg" && s === "reg") {
    const rc = regCode(dst.name)
    const rs = regCode(src.name)
    const rByte = rex(true, highReg(rc), false, highReg(rs))
    return { bytes: [rByte, 0x23, modrm(3, rc & 7, rs & 7)], relocs: [] }
  }
  if (d === "reg" && s === "imm") {
    return encodeAluImm(dst, src, 4)
  }
  throw new Error(`unsupported and: ${d} ${s}`)
}

export function encodeOr(dst: any, src: any): EncodedOp {
  const d = classify(dst)
  const s = classify(src)
  if (d === "reg" && s === "reg") {
    const rc = regCode(dst.name)
    const rs = regCode(src.name)
    const rByte = rex(true, highReg(rc), false, highReg(rs))
    return { bytes: [rByte, 0x0b, modrm(3, rc & 7, rs & 7)], relocs: [] }
  }
  if (d === "reg" && s === "imm") {
    return encodeAluImm(dst, src, 1)
  }
  throw new Error(`unsupported or: ${d} ${s}`)
}

export function encodeXor(dst: any, src: any): EncodedOp {
  const d = classify(dst)
  const s = classify(src)
  if (d === "reg" && s === "reg") {
    const rc = regCode(dst.name)
    const rs = regCode(src.name)
    const rByte = rex(true, highReg(rc), false, highReg(rs))
    return { bytes: [rByte, 0x33, modrm(3, rc & 7, rs & 7)], relocs: [] }
  }
  if (d === "reg" && s === "imm") {
    return encodeAluImm(dst, src, 6)
  }
  throw new Error(`unsupported xor: ${d} ${s}`)
}

export function encodeTest(dst: any, src: any): EncodedOp {
  const rc = regCode(dst.name)
  const rs = regCode(src.name)
  const rByte = rex(true, highReg(rc), false, highReg(rs))
  return { bytes: [rByte, 0x85, modrm(3, rs & 7, rc & 7)], relocs: [] }
}

export function encodeShl(dst: any, src: any): EncodedOp {
  return encodeShift(dst, src, 4)
}

export function encodeShr(dst: any, src: any): EncodedOp {
  return encodeShift(dst, src, 5)
}

export function encodePush(src: any): EncodedOp {
  const s = classify(src)
  if (s === "reg") {
    const sc = regCode(src.name)
    if (highReg(sc)) {
      return { bytes: [0x41, 0x50 | (sc & 7)], relocs: [] }
    }
    return { bytes: [0x50 | sc], relocs: [] }
  }
  if (s === "imm") {
    const bytes: number[] = [0x68, 0, 0, 0, 0]
    writeI32toBytes(bytes, 1, Number(src.value))
    return { bytes, relocs: [] }
  }
  throw new Error(`unsupported push: ${s}`)
}

export function encodePop(dst: any): EncodedOp {
  const dc = regCode(dst.name)
  if (highReg(dc)) {
    return { bytes: [0x41, 0x58 | (dc & 7)], relocs: [] }
  }
  return { bytes: [0x58 | dc], relocs: [] }
}

export function encodeRet(): EncodedOp {
  return { bytes: [0xc3], relocs: [] }
}

export function encodeCallRel32(label: LabelReloc): EncodedOp {
  return { bytes: [0xe8, 0, 0, 0, 0], relocs: [{ offset: 1, kind: "REL32", label }] }
}

export function encodeCallMem(mem: any): EncodedOp {
  const info = getMemInfo(mem)
  const { rex: rexVal, modrm: mrm, sib: sibByte, dispBytes } = encodeMemModrm(info.base?.name, info.index?.name, info.scale, info.disp !== undefined ? BigInt(info.disp) : undefined)
  const bytes = [rexVal, 0xff, modrm(3, 2, mrm & 7)]
  if (sibByte !== null) bytes.push(sibByte)
  for (const b of dispBytes) bytes.push(b)
  return { bytes, relocs: [] }
}

export function encodeJmpRel(label: LabelReloc): EncodedOp {
  return { bytes: [0xe9, 0, 0, 0, 0], relocs: [{ offset: 1, kind: "REL32", label }] }
}

export function encodeJcc(cc: string, label: LabelReloc): EncodedOp {
  const op = jccOpcode(cc)
  return { bytes: [0x0f, op, 0, 0, 0, 0], relocs: [{ offset: 2, kind: "REL32", label }] }
}

export function encodeLea(dst: any, src: any): EncodedOp {
  return encodeMemToReg(dst, src, 0x8d)
}

// ===== HELPERS =====

function encodeAluImm(dst: any, src: any, regOp: number): EncodedOp {
  const rc = regCode(dst.name)
  const rByte = rex(true, false, false, highReg(rc))
  const imm = src.value
  if (fits8(imm)) {
    return { bytes: [rByte, 0x83, modrm(3, regOp, rc & 7), Number(imm) & 0xff], relocs: [] }
  }
  const bytes = [rByte, 0x81, modrm(3, regOp, rc & 7)]
  writeI32(bytes, Number(imm))
  return { bytes, relocs: [] }
}

function encodeMemToReg(reg: any, mem: any, opcode: number): EncodedOp {
  const rc = regCode(reg.name)
  const info = getMemInfo(mem)
  const { rex: rexVal, modrm: mrm, sib: sibByte, dispBytes } = encodeMemModrm(info.base?.name, info.index?.name, info.scale, info.disp !== undefined ? BigInt(info.disp) : undefined)
  const newRex = rex(true, highReg(rc), false, false) | (rexVal & 0x07)
  const bytes = [newRex, opcode, modrm(3, rc & 7, mrm & 7)]
  if (sibByte !== null) bytes.push(sibByte)
  for (const b of dispBytes) bytes.push(b)
  return { bytes, relocs: [] }
}

function encodeRegToMem(mem: any, reg: any, opcode: number): EncodedOp {
  const rc = regCode(reg.name)
  const info = getMemInfo(mem)
  const { rex: rexVal, modrm: mrm, sib: sibByte, dispBytes } = encodeMemModrm(info.base?.name, info.index?.name, info.scale, info.disp !== undefined ? BigInt(info.disp) : undefined)
  const newRex = rex(true, highReg(rc), false, false) | (rexVal & 0x07)
  const bytes = [newRex, opcode, modrm(3, rc & 7, mrm & 7)]
  if (sibByte !== null) bytes.push(sibByte)
  for (const b of dispBytes) bytes.push(b)
  return { bytes, relocs: [] }
}

function encodeImmToMem(mem: any, imm: any): EncodedOp {
  const info = getMemInfo(mem)
  const { rex: rexVal, modrm: mrm, sib: sibByte, dispBytes } = encodeMemModrm(info.base?.name, info.index?.name, info.scale, info.disp !== undefined ? BigInt(info.disp) : undefined)
  const bytes = [rexVal, 0xc7, modrm(3, 0, mrm & 7)]
  if (sibByte !== null) bytes.push(sibByte)
  for (const b of dispBytes) bytes.push(b)
  writeI32(bytes, Number(imm.value))
  return { bytes, relocs: [] }
}

function encodeLabelDerefToReg(reg: any, labelDeref: any, opcode: number): EncodedOp {
  const rc = regCode(reg.name)
  const rByte = rex(true, highReg(rc), false, false)
  const label: LabelReloc = toLabelReloc(labelDeref)
  return { bytes: [rByte, opcode, modrm(0, rc & 7, 5), 0, 0, 0, 0], relocs: [{ offset: 3, kind: "REL32", label }] }
}

function encodeShift(dst: any, src: any, regOp: number): EncodedOp {
  const rc = regCode(dst.name)
  const s = classify(src)
  if (s !== "imm") throw new Error("shift amount must be imm")
  const imm = Number(src.value)
  const rByte = rex(true, false, false, highReg(rc))
  if (imm === 1) {
    return { bytes: [rByte, 0xd1, modrm(3, regOp, rc & 7)], relocs: [] }
  }
  return { bytes: [rByte, 0xc1, modrm(3, regOp, rc & 7), imm & 0xff], relocs: [] }
}

function getMemInfo(op: any): MemInfo {
  switch (op.kind) {
    case "RegDerefOperand": return {
      base: { name: op.base },
      index: op.index ? { name: op.index } : undefined,
      scale: op.scale ? Number(op.scale) : undefined,
      disp: op.disp !== undefined ? Number(op.disp) : undefined,
    }
    case "LabelDerefOperand": return {}
    default: throw new Error(`not a memory operand: ${op.kind}`)
  }
}

function toLabelReloc(op: any): LabelReloc {
  switch (op.kind) {
    case "LabelImmOperand":
    case "LabelDerefOperand":
      return { name: op.label.name, path: op.label.path, addend: 0 }
    case "LabelOperand":
      return { name: op.name, path: op.path, addend: 0 }
    default:
      throw new Error(`not a label operand: ${op.kind}`)
  }
}

function writeImm64(bytes: number[], value: bigint): void {
  const abs = value < 0n ? -value : value
  for (let i = 0; i < 8; i++) {
    bytes.push(Number((abs >> BigInt(i * 8)) & 0xffn))
  }
}

function writeI32toBytes(bytes: number[], offset: number, value: number): void {
  const dv = new DataView(new ArrayBuffer(4))
  dv.setInt32(0, value, true)
  for (let i = 0; i < 4; i++) bytes[offset + i] = dv.getUint8(i)
}

function jccOpcode(cc: string): number {
  switch (cc) {
    case "e": return 0x84
    case "ne": return 0x85
    case "l": return 0x8c
    case "le": return 0x8e
    case "g": return 0x8f
    case "ge": return 0x8d
    case "b": return 0x82
    case "be": return 0x86
    case "a": return 0x87
    case "ae": return 0x83
    default: throw new Error(`unknown cc: ${cc}`)
  }
}
