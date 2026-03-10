import { createUrl } from "@xieyuheng/helpers.js/url"
import * as L from "../index.ts"

export function importBy(path: string, mod: L.Mod): L.Mod {
  let url = urlRelativeToMod(path, mod)
  if (url.protocol === "file:") {
    url.pathname = L.resolveModPath(url.pathname)
  }

  return L.loadMod(url, mod.dependencyGraph)
}

function urlRelativeToMod(path: string, mod: L.Mod): URL {
  if (mod.url.protocol === "file:") {
    const url = new URL(path, mod.url)
    if (url.href === mod.url.href) {
      let message = `[urlRelativeToMod] A module can not import itself: ${path}`
      throw new Error(message)
    }

    return url
  }

  return createUrl(path)
}
