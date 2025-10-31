import { createMod, type Mod } from "../mod/index.ts"

export function load(url: URL): Mod {
  const mod = createMod(url)
  return mod
}
