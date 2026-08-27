import * as S from "@xieyuheng/sexp.js"
import * as X2 from "../index.ts"
import { parseInstr } from "./parseInstr.ts"

export function parseDefinition(sexp: S.Sexp): X2.Definition {
  const list = S.asListSexp(sexp)
  const head = S.asSymbolSexp(list.elements[0]).content
  const elements = list.elements

  switch (head) {
    case "define-function": {
      const signature = S.asListSexp(elements[1])
      const name = S.asSymbolSexp(signature.elements[0]).content
      const parameters = signature.elements
        .slice(1)
        .map((parameter) => S.asSymbolSexp(parameter).content)
      const instrs = elements.slice(2).map((elem) => parseInstr(elem))
      return X2.FunctionDefinition(name, parameters, instrs)
    }

    case "declare-variable": {
      const name = S.asSymbolSexp(elements[1]).content
      return X2.VariableDeclaration(name)
    }

    case "declare-primitive-function": {
      const name = S.asSymbolSexp(elements[1]).content
      const arity = Number(S.asIntSexp(elements[2]).content)
      return X2.PrimitiveFunctionDeclaration(name, arity)
    }

    case "declare-primitive-variable": {
      const name = S.asSymbolSexp(elements[1]).content
      return X2.PrimitiveVariableDeclaration(name)
    }

    default: {
      throw new S.ErrorWithSourceLocation(
        `[parseDefinition] unknown definition form: ${S.formatSexp(sexp)}`,
        sexp.location,
      )
    }
  }
}
