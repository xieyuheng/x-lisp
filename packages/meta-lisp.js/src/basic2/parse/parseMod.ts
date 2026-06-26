import * as S from "@xieyuheng/sexp.js"
import * as B from "../index.ts"
import { parseDefinition } from "./parseDefinition.ts"

export function parseMod(sexps: Array<S.Sexp>): B.Mod {
  const mod = B.createMod()
  for (const sexp of sexps) {
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
