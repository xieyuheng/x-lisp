import { createUrlOrFileUrl } from "../../utils/url/createUrlOrFileUrl.ts"
import { load } from "../load/index.ts"
import { type Mod } from "./Mod.ts"

export function modImport(mod: Mod, path: string): Mod {
  if (mod.url.protocol === "file:") {
    const url = new URL(path, mod.url)
    if (url.href === mod.url.href) {
      let message = `[modImport] A module can not import itself: ${path}\n`
      throw new Error(message)
    }

    return load(url)
  }

  if (mod.url.protocol === "repl:") {
    const url = createUrlOrFileUrl(path)
    return load(url)
  }

  let message = `[modImport] unhandled url protocol: ${path}\n`
  throw new Error(message)
}
