export type Metadata =
  | IntMetadata
  | FloatMetadata
  | StringMetadata
  | PointerMetadata
  | ListMetadata
  | RecordMetadata

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

export type PointerMetadata = {
  kind: "PointerMetadata"
  name: string
}

export function PointerMetadata(name: string): PointerMetadata {
  return {
    kind: "PointerMetadata",
    name,
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
