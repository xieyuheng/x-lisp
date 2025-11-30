import * as B from "../index.ts"

export function isRecordMetadata(
  metadata: B.Metadata,
): metadata is B.RecordMetadata {
  return metadata.kind === "RecordMetadata"
}

export function asRecordMetadata(metadata: B.Metadata): B.RecordMetadata {
  if (metadata.kind === "RecordMetadata") return metadata
  throw new Error(`[asRecordMetadata] fail on: ${B.formatMetadata(metadata)}`)
}
