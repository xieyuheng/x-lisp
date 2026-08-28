import * as S from "@xieyuheng/sexp.js"
import * as Xvm2 from "../index.ts"
import { parseDefinition } from "./parseDefinition.ts"

export function parseProgram(sexps: Array<S.Sexp>): Xvm2.Program {
  const program = Xvm2.createProgram()
  for (const sexp of sexps) {
    const list = S.asListSexp(sexp)
    const head = S.asSymbolSexp(list.elements[0]).content

    if (head === "default-entry") {
      const entry = S.asSymbolSexp(list.elements[1]).content
      if (program.entry !== undefined) {
        throw new S.ErrorWithSourceLocation(
          `[parseProgram] duplicate default-entry`,
          sexp.location,
        )
      }
      program.entry = entry
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
