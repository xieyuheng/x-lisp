import { createUrlOrFileUrl } from "../../utils/url/createUrlOrFileUrl.ts"
import { load } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"

export function importByMod(path: string, mod: Mod): Mod {
  if (mod.url.protocol === "file:") {
    const url = new URL(path, mod.url)
    if (url.href === mod.url.href) {
      let message = `[importByMod] A module can not import itself: ${path}\n`
      throw new Error(message)
    }

    return load(url)
  }

  if (mod.url.protocol === "repl:") {
    const url = createUrlOrFileUrl(path)
    return load(url)
  }

  let message = `[importByMod] unhandled url protocol: ${path}\n`
  throw new Error(message)
}
