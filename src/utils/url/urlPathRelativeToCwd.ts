import Path from "node:path"
import process from "node:process"

export function urlPathRelativeToCwd(url: URL): string {
  if (url.protocol === "file:") {
    return Path.relative(process.cwd(), url.pathname)
  }

  return url.pathname
}
