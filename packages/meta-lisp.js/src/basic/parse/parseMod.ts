import * as S from "@xieyuheng/sexp.js"
import * as B from "../index.ts"
import { parseDefinition } from "./parseDefinition.ts"
import { parseType } from "./parseType.ts"

export function parseMod(sexps: Array<S.Sexp>): B.Mod {
  const mod = B.createMod()
  for (const sexp of sexps) {
    const list = S.asListSexp(sexp)
    const head = S.asSymbolSexp(list.elements[0])

    if (head.content === "claim") {
      const name = S.asSymbolSexp(list.elements[1]).content
      if (mod.claims.has(name)) {
        throw new S.ErrorWithSourceLocation(
          `[parseMod] duplicate claim: ${name}`,
          sexp.location,
        )
      }
      const type = parseType(list.elements[2])
      mod.claims.set(name, type)
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
