import fs from "node:fs"

export function fetchTextSync(url: URL): string {
  if (url.protocol === "file:") {
    return fs.readFileSync(url.pathname, "utf8")
  }

  throw new Error(`[fetchTextSync] not supported protocol: ${url}`)
}
