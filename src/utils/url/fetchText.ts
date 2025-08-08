import fs from "node:fs"

export async function fetchText(url: URL): Promise<string> {
  if (url.protocol === "http:" || url.protocol === "https:") {
    const response = await fetch(url)
    return await response.text()
  }

  if (url.protocol === "file:") {
    return await fs.promises.readFile(url.pathname, "utf8")
  }

  throw new Error(`[fetchText] not supported protocol: ${url}`)
}
