import Path from "node:path"

export function createFileUrl(path: string): URL {
  const fullPath = Path.resolve(path)
  return new URL(`file:${fullPath}`)
}
