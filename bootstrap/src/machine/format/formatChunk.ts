import { type Chunk } from "../chunk/Chunk.ts"
import { formatDirective } from "./formatDirective.ts"

export function formatChunk(chunk: Chunk): string {
  const directives = chunk.directives.map(formatDirective).join(" ")
  return `(chunk ${chunk.label} ${directives})`
}
