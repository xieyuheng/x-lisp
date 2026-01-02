import * as B from "../index.ts"

export function isIntMetadata(metadata: B.Metadata): metadata is B.IntMetadata {
  return metadata.kind === "IntMetadata"
}

export function asIntMetadata(metadata: B.Metadata): B.IntMetadata {
  if (metadata.kind === "IntMetadata") return metadata
  throw new Error(`[asIntMetadata] fail on: ${B.formatMetadata(metadata)}`)
}

export function isFloatMetadata(
  metadata: B.Metadata,
): metadata is B.FloatMetadata {
  return metadata.kind === "FloatMetadata"
}

export function asFloatMetadata(metadata: B.Metadata): B.FloatMetadata {
  if (metadata.kind === "FloatMetadata") return metadata
  throw new Error(`[asFloatMetadata] fail on: ${B.formatMetadata(metadata)}`)
}

export function isStringMetadata(
  metadata: B.Metadata,
): metadata is B.StringMetadata {
  return metadata.kind === "StringMetadata"
}

export function asStringMetadata(metadata: B.Metadata): B.StringMetadata {
  if (metadata.kind === "StringMetadata") return metadata
  throw new Error(`[asStringMetadata] fail on: ${B.formatMetadata(metadata)}`)
}

export function isPointerMetadata(
  metadata: B.Metadata,
): metadata is B.PointerMetadata {
  return metadata.kind === "PointerMetadata"
}

export function asPointerMetadata(metadata: B.Metadata): B.PointerMetadata {
  if (metadata.kind === "PointerMetadata") return metadata
  throw new Error(`[asPointerMetadata] fail on: ${B.formatMetadata(metadata)}`)
}

export function isListMetadata(
  metadata: B.Metadata,
): metadata is B.ListMetadata {
  return metadata.kind === "ListMetadata"
}

export function asListMetadata(metadata: B.Metadata): B.ListMetadata {
  if (metadata.kind === "ListMetadata") return metadata
  throw new Error(`[asListMetadata] fail on: ${B.formatMetadata(metadata)}`)
}

export function isRecordMetadata(
  metadata: B.Metadata,
): metadata is B.RecordMetadata {
  return metadata.kind === "RecordMetadata"
}

export function asRecordMetadata(metadata: B.Metadata): B.RecordMetadata {
  if (metadata.kind === "RecordMetadata") return metadata
  throw new Error(`[asRecordMetadata] fail on: ${B.formatMetadata(metadata)}`)
}
