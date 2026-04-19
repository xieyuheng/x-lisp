import type { Mod } from "../mod/index.ts"
import { formatLine } from "./formatLine.ts"

export function formatMod(mod: Mod): string {
  return mod.lines.map(formatLine).join("\n") + "\n"
}
