import { type Definition } from "../definition/index.ts"

export type Mod = {
  url: URL
  defined: Map<string, Definition>
}

export function createMod(url: URL): Mod {
  return {
    url,
    defined: new Map(),
  }
}
