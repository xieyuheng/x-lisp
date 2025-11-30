export type Metadata =
  | IntMetadata
  | FloatMetadata
  | StringMetadata
  | VarMetadata
  | RecordMetadata
  | ListMetadata

export type IntMetadata = {
  kind: "IntMetadata"
  content: bigint
}

export function IntMetadata(content: bigint): IntMetadata {
  return {
    kind: "IntMetadata",
    content,
  }
}

export type FloatMetadata = {
  kind: "FloatMetadata"
  content: number
}

export function FloatMetadata(content: number): FloatMetadata {
  return {
    kind: "FloatMetadata",
    content,
  }
}

export type StringMetadata = {
  kind: "StringMetadata"
  content: string
}

export function StringMetadata(content: string): StringMetadata {
  return {
    kind: "StringMetadata",
    content,
  }
}

export type VarMetadata = {
  kind: "VarMetadata"
  name: string
}

export function VarMetadata(name: string): VarMetadata {
  return {
    kind: "VarMetadata",
    name,
  }
}

export type RecordMetadata = {
  kind: "RecordMetadata"
  attributes: Record<string, Metadata>
}

export function RecordMetadata(
  attributes: Record<string, Metadata>,
): RecordMetadata {
  return {
    kind: "RecordMetadata",
    attributes,
  }
}

export type ListMetadata = {
  kind: "ListMetadata"
  elements: Array<Metadata>
}

export function ListMetadata(elements: Array<Metadata>): ListMetadata {
  return {
    kind: "ListMetadata",
    elements,
  }
}
