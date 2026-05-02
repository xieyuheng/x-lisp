import * as S from "@xieyuheng/sexp.js"
import { formatDefinition } from "../format/formatDefinition.ts"
import type { Mod } from "../mod/index.ts"
import { sexpConfig } from "./sexpConfig.ts"

export const prettyDefinition = S.prettySexpByFormat(
  formatDefinition,
  sexpConfig,
)

export function prettyMod(textWidth: number, mod: Mod) {
  return Array.from(
    mod.definitions
      .values()
      .map((definition) => prettyDefinition(textWidth, definition)),
  ).join("\n")
}
