import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function desugarQuote(sexp: S.Sexp, location: S.SourceLocation): M.Exp {
  switch (sexp.kind) {
    case "SymbolSexp": {
      return M.SymbolExp(sexp.content, location)
    }

    case "StringSexp": {
      return M.StringExp(sexp.content, location)
    }

    case "IntSexp": {
      return M.IntExp(sexp.content, location)
    }

    case "FloatSexp": {
      return M.FloatExp(sexp.content, location)
    }

    case "ListSexp": {
      return M.ListExp(
        sexp.elements.map((e) => desugarQuote(e, location)),
        location,
      )
    }
  }
}
