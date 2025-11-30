import type { Metadata } from "../metadata/index.ts"

export function formatMetadata(metadata: Metadata): string {
  switch (metadata.kind) {
    case "IntMetadata": {
      return `${metadata.content}`
    }

    case "FloatMetadata": {
      if (Number.isInteger(metadata.content)) {
        return `${metadata.content.toString()}.0`
      } else {
        return metadata.content.toString()
      }
    }

    case "StringMetadata": {
      return JSON.stringify(metadata.content)
    }

    case "VarMetadata": {
      return metadata.name
    }

    case "RecordMetadata": {
      const attributes = Object.entries(metadata.attributes)
        .map(([k, v]) => `:${k} ${formatMetadata(v)}`)
        .join(" ")
      return `{${attributes}}`
    }

    case "ListMetadata": {
      const elements = metadata.elements.map(formatMetadata).join(" ")
      return `[${elements}]`
    }
  }
}
