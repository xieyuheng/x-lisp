import * as S from "@xieyuheng/sexp.js"
import * as B from "../index.ts"
import { parseDefinition } from "./parseDefinition.ts"
import { parseType } from "./parseType.ts"

export function parseProgram(sexps: Array<S.Sexp>): B.Program {
  const program = B.createProgram()
  for (const sexp of sexps) {
    const list = S.asListSexp(sexp)
    const head = S.asSymbolSexp(list.elements[0])

    if (head.content === "claim") {
      const name = S.asSymbolSexp(list.elements[1]).content
      if (program.claims.has(name)) {
        throw new S.ErrorWithSourceLocation(
          `[parseProgram] duplicate claim: ${name}`,
          sexp.location,
        )
      }
      const type = parseType(list.elements[2])
      program.claims.set(name, type)
      continue
    }

    const definition = parseDefinition(sexp)
    if (program.definitions.has(definition.name)) {
      throw new S.ErrorWithSourceLocation(
        `[parseProgram] duplicate definition: ${definition.name}`,
        sexp.location,
      )
    }
    program.definitions.set(definition.name, definition)
  }
  return program
}
