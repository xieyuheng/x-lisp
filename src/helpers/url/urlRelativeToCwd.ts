import Path from "node:path"
import process from "node:process"

export function urlRelativeToCwd(url: URL): string {
  if (url.protocol === "file:") {
    return Path.relative(process.cwd(), url.pathname)
  }

  return url.href
}
