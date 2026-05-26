import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { desugarLocation } from "./desugarLocation.ts"

export function desugarSexp(sexp: S.Sexp): M.Exp {
  switch (sexp.kind) {
    case "SymbolSexp": {
      return M.ApplyExp(
        M.QualifiedVarExp("builtin", "symbol-sexp", sexp.location),
        [
          M.SymbolExp(sexp.content, sexp.location),
          desugarLocation(sexp.location),
        ],
        sexp.location,
      )
    }

    case "StringSexp": {
      return M.ApplyExp(
        M.QualifiedVarExp("builtin", "string-sexp", sexp.location),
        [
          M.StringExp(sexp.content, sexp.location),
          desugarLocation(sexp.location),
        ],
        sexp.location,
      )
    }

    case "IntSexp": {
      return M.ApplyExp(
        M.QualifiedVarExp("builtin", "int-sexp", sexp.location),
        [M.IntExp(sexp.content, sexp.location), desugarLocation(sexp.location)],
        sexp.location,
      )
    }

    case "FloatSexp": {
      return M.ApplyExp(
        M.QualifiedVarExp("builtin", "float-sexp", sexp.location),
        [
          M.FloatExp(sexp.content, sexp.location),
          desugarLocation(sexp.location),
        ],
        sexp.location,
      )
    }

    case "KeywordSexp": {
      return M.ApplyExp(
        M.QualifiedVarExp("builtin", "keyword-sexp", sexp.location),
        [
          M.KeywordExp(sexp.content, sexp.location),
          desugarLocation(sexp.location),
        ],
        sexp.location,
      )
    }

    case "ListSexp": {
      return M.ApplyExp(
        M.QualifiedVarExp("builtin", "list-sexp", sexp.location),
        [
          M.ListExp(
            sexp.elements.map((e) => desugarSexp(e)),
            sexp.location,
          ),
          desugarLocation(sexp.location),
        ],
        sexp.location,
      )
    }
  }
}
