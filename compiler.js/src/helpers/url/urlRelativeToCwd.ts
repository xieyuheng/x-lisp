import Path from "node:path"
import process from "node:process"

export function urlRelativeToCwd(url: URL): string {
  if (url.protocol === "file:") {
    return pathRelativeToCwd(url.pathname)
  }

  return url.href
}

export function pathRelativeToCwd(path: string): string {
  return Path.relative(process.cwd(), path)
}
