import * as S from "@xieyuheng/sexp.js"
import * as X2 from "../index.ts"
import { parseDefinition } from "./parseDefinition.ts"

export function parseMod(sexps: Array<S.Sexp>): X2.Mod {
  const mod = X2.createMod()
  for (const sexp of sexps) {
    const list = S.asListSexp(sexp)
    const head = S.asSymbolSexp(list.elements[0]).content

    if (head === "default-entry") {
      const entry = S.asSymbolSexp(list.elements[1]).content
      if (mod.entry !== undefined) {
        throw new S.ErrorWithSourceLocation(
          `[parseMod] duplicate default-entry`,
          sexp.location,
        )
      }
      mod.entry = entry
      continue
    }

    const definition = parseDefinition(sexp)
    if (mod.definitions.has(definition.name)) {
      throw new S.ErrorWithSourceLocation(
        `[parseMod] duplicate definition: ${definition.name}`,
        sexp.location,
      )
    }
    mod.definitions.set(definition.name, definition)
  }
  return mod
}
