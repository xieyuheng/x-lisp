import * as Ppml from "@xieyuheng/ppml.js"
import type { Mod } from "../mod/index.ts"

export function prettyMod(maxWidth: number, mod: Mod): string {
  return Ppml.format(maxWidth, renderMod(mod))
}

function renderMod(mod: Mod): Ppml.Node {
  // TODO
  return Ppml.nil()
}
