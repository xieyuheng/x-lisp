import fs from "node:fs"

export function fileUrlExists(url: URL): boolean {
  if (url.protocol === "file:") {
    return fs.existsSync(url.pathname)
  }

  throw new Error(`[fileUrlExists] not supported protocol: ${url}`)
}
