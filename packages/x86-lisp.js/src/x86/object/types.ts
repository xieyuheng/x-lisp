export const ObjectCodeSection = 0 as const
export const ObjectDataSection = 1 as const
export const ObjectSpaceSection = 2 as const

export type ObjectSectionKind =
  | typeof ObjectCodeSection
  | typeof ObjectDataSection
  | typeof ObjectSpaceSection

export type ObjectLabelKind = "function" | "data" | "space" | "local"

export type ObjectLabelEntry = {
  name: string
  kind: ObjectLabelKind
  sectionKind: ObjectSectionKind
  sectionOffset: number
}

export type ObjectRelocation = {
  type: string
  name: string
  sectionKind: ObjectSectionKind
  sectionOffset: number
  addend: bigint
}

export type ObjectFile = {
  code: Uint8Array
  data: Uint8Array
  spaceSize: number
  labels: Array<ObjectLabelEntry>
  relocations: Array<ObjectRelocation>
}
