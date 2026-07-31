export const XexeCodeSegment = 0 as const
export const XexeDataSegment = 1 as const
export const XexeSpaceSegment = 2 as const

export type XexeSegmentKind =
  typeof XexeCodeSegment | typeof XexeDataSegment | typeof XexeSpaceSegment

export type XexeLabelEntry = {
  name: string
  segmentKind: XexeSegmentKind
  segmentOffset: number
}

export type XexeRelocationEntry = {
  type: string
  name: string
  segmentKind: XexeSegmentKind
  segmentOffset: number
  addend: bigint
}

export type Xexe = {
  code: Uint8Array
  data: Uint8Array
  spaceSize: number
  entryCodeSegmentOffset: number
  labelTable: Array<XexeLabelEntry>
  relocationTable: Array<XexeRelocationEntry>
}
