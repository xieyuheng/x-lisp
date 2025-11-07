import { createFileUrl } from "./createFileUrl.ts"
import { isValidUrl } from "./isValidUrl.ts"

export function createUrlOrFileUrl(path: string): URL {
  return isValidUrl(path) ? new URL(path) : createFileUrl(path)
}
