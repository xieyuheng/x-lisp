export const ExeCodeSegment = 0 as const
export const ExeDataSegment = 1 as const
export const ExeSpaceSegment = 2 as const

export type ExeSegmentKind =
  typeof ExeCodeSegment | typeof ExeDataSegment | typeof ExeSpaceSegment

export type ExeLabelEntry = {
  name: string
  segmentKind: ExeSegmentKind
  segmentOffset: number
}

export type ExeFixupEntry = {
  type: string
  name: string
  segmentKind: ExeSegmentKind
  segmentOffset: number
  addend: bigint
}

export type Exe = {
  code: Uint8Array
  data: Uint8Array
  spaceSize: number
  entryCodeSegmentOffset: number
  labelTable: Array<ExeLabelEntry>
  fixupTable: Array<ExeFixupEntry>
}
