import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { desugarLocationZh } from "./desugarLocationZh.ts"

export function desugarSexpZh(sexp: S.Sexp): M.Exp {
  switch (sexp.kind) {
    case "SymbolSexp": {
      return M.ApplyExp(
        M.QualifiedVarExp(
          "meta-builtin",
          "内置",
          "符号符号算式",
          sexp.location,
        ),
        [
          M.SymbolExp(sexp.content, sexp.location),
          desugarLocationZh(sexp.location),
        ],
        sexp.location,
      )
    }

    case "StringSexp": {
      return M.ApplyExp(
        M.QualifiedVarExp(
          "meta-builtin",
          "内置",
          "文本符号算式",
          sexp.location,
        ),
        [
          M.StringExp(sexp.content, sexp.location),
          desugarLocationZh(sexp.location),
        ],
        sexp.location,
      )
    }

    case "IntSexp": {
      return M.ApplyExp(
        M.QualifiedVarExp(
          "meta-builtin",
          "内置",
          "整数符号算式",
          sexp.location,
        ),
        [
          M.IntExp(sexp.content, sexp.location),
          desugarLocationZh(sexp.location),
        ],
        sexp.location,
      )
    }

    case "FloatSexp": {
      return M.ApplyExp(
        M.QualifiedVarExp(
          "meta-builtin",
          "内置",
          "浮点符号算式",
          sexp.location,
        ),
        [
          M.FloatExp(sexp.content, sexp.location),
          desugarLocationZh(sexp.location),
        ],
        sexp.location,
      )
    }

    case "ListSexp": {
      return M.ApplyExp(
        M.QualifiedVarExp(
          "meta-builtin",
          "内置",
          "列表符号算式",
          sexp.location,
        ),
        [
          M.ListExp(sexp.elements.map(desugarSexpZh), sexp.location),
          desugarLocationZh(sexp.location),
        ],
        sexp.location,
      )
    }
  }
}
