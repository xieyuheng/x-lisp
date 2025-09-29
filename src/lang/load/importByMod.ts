import fs from "node:fs"
import { createUrlOrFileUrl } from "../../utils/url/createUrlOrFileUrl.ts"
import { urlRelativeToCwd } from "../../utils/url/urlRelativeToCwd.ts"
import { load } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"

export function importByMod(path: string, mod: Mod): Mod {
  return load(resoleModUrl(path, mod))
}

function resoleModUrl(path: string, mod: Mod): URL {
  let url = urlRelativeToMod(path, mod)
  if (url.protocol === "file:") {
    if (
      fs.existsSync(url.pathname) &&
      fs.lstatSync(url.pathname).isDirectory()
    ) {
      url = new URL(`${url.href}/index.lisp`)
    }

    if (!fs.existsSync(url.pathname)) {
      let message = `[resoleModUrl] resolved path does not exist as a file\n`
      message += `  given path: ${path}\n`
      message += `  resolved path: ${url.pathname}\n`
      message += `  imported by mod: ${urlRelativeToCwd(mod.url)}\n`
      throw new Error(message)
    }
  }

  return url
}

function urlRelativeToMod(path: string, mod: Mod): URL {
  if (mod.url.protocol === "file:") {
    const url = new URL(path, mod.url)
    if (url.href === mod.url.href) {
      let message = `[importByMod] A module can not import itself: ${path}\n`
      throw new Error(message)
    }

    return url
  }

  return createUrlOrFileUrl(path)
}
