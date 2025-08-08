import fs from "node:fs"
const fetchSync = require("sync-fetch")

export function fetchTextSync(url: URL): string {
  if (url.protocol === "http:" || url.protocol === "https:") {
    const response = fetchSync(url)
    return response.text()
  }

  if (url.protocol === "file:") {
    return fs.readFileSync(url.pathname, "utf8")
  }

  throw new Error(`[fetchText] unknown protocol: ${url}`)
}
