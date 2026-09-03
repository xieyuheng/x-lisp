export const FixupTypeValues = [
  "string-value",
  "symbol-value",
  "fn-pointer",
  "prim-pointer",
  "global-pointer",
] as const

export type FixupType = (typeof FixupTypeValues)[number]

export function parseFixupType(name: string): FixupType {
  for (const type of FixupTypeValues) {
    if (type === name) {
      return type
    }
  }

  throw new Error(`[parseFixupType] unknown fixup type: ${name}`)
}

export type FunctionFixup = {
  type: FixupType
  name: string
  destName: string
  destOffset: number
}

export type FunctionFixupTable = {
  fixups: Array<FunctionFixup>
}