import { formatIndent } from "../../../helpers/format/formatIndent.ts"
import { type Definition } from "../definition/index.ts"
import { prettyMod } from "../pretty/index.ts"

export type Mod = {
  url: URL
  definitions: Map<string, Definition>
}

export function createMod(url: URL): Mod {
  return {
    url,
    definitions: new Map(),
  }
}

export function modLookup(mod: Mod, name: string): Definition | undefined {
  return mod.definitions.get(name)
}

export function logMod(tag: string, mod: Mod): Mod {
  console.log(`${tag}:`)
  console.log(formatIndent(4, "\n" + prettyMod(64, mod)))
  console.log()
  return mod
}
