import { createUrlOrFileUrl } from "../../helpers/url/createUrlOrFileUrl.ts"
import { type Mod } from "../mod/index.ts"
import { load } from "./index.ts"
import { resolveModPath } from "./resolveModPath.ts"

export function importByMod(path: string, mod: Mod): Mod {
  let url = urlRelativeToMod(path, mod)
  if (url.protocol === "file:") {
    url.pathname = resolveModPath(url.pathname)
  }

  return load(url)
}

function urlRelativeToMod(path: string, mod: Mod): URL {
  if (mod.url.protocol === "file:") {
    const url = new URL(path, mod.url)
    if (url.href === mod.url.href) {
      let message = `[urlRelativeToMod] A module can not import itself: ${path}`
      throw new Error(message)
    }

    return url
  }

  return createUrlOrFileUrl(path)
}
