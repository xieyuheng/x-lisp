import path from "node:path"
import { fileURLToPath } from "node:url"

export function useStdDirectory(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url))
  return path.join(currentDir, "../../../std")
}
