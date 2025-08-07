import { load } from "../load/index.ts"
import { type Mod } from "./Mod.ts"

export function modResolve(mod: Mod, href: string): URL {
  return new URL(href, mod.url)
}

export async function modImport(mod: Mod, path: string): Promise<Mod> {
  const url = modResolve(mod, path)
  if (url.href === mod.url.href) {
    throw new Error(`[modImport] A module can not import itself: ${path}\n`)
  }

  return await load(url)
}
