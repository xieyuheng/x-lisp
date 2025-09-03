import { createUrlOrFileUrl } from "../../utils/url/createUrlOrFileUrl.ts"
import { fileUrlExists } from "../../utils/url/fileUrlExists.ts"
import { urlRelativeToCwd } from "../../utils/url/urlRelativeToCwd.ts"
import { load } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"

export function importByMod(path: string, mod: Mod): Mod {
  const url = createTargetUrl(path, mod)
  if (!fileUrlExists(url)) {
    let message = `[importByMod] Importing non-existing file\n`
    message += `  path: ${path}\n`
    message += `  by mod: ${urlRelativeToCwd(mod.url)}\n`
    throw new Error(message)
  }

  return load(url)
}

function createTargetUrl(path: string, mod: Mod): URL {
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
