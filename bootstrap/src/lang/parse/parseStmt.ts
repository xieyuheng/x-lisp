import * as S from "@xieyuheng/x-sexp.js"
import * as Exps from "../exp/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { parseExp } from "./parseExp.ts"

export function parseStmt(sexp: S.Sexp): Stmt {
  return S.match(stmtMatcher, sexp)
}

const stmtMatcher: S.Matcher<Stmt> = S.matcherChoice<Stmt>([
  S.matcher(
    "(cons* 'define (cons* name parameters) body)",
    ({ name, parameters, body }, { sexp }) => {
      const keyword = S.asTael(sexp).elements[1]
      const meta = S.tokenMetaFromSexpMeta(keyword.meta)
      return Stmts.DefineFunction(
        S.symbolContent(name),
        S.listElements(parameters).map(S.symbolContent),
        Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
        meta,
      )
    },
  ),

  S.matcher("(cons* 'export names)", ({ names }, { meta }) => {
    return Stmts.Export(S.listElements(names).map(S.symbolContent), meta)
  }),

  S.matcher("`(import-all ,source)", ({ source }, { meta }) => {
    return Stmts.ImportAll(S.stringContent(source), meta)
  }),

  S.matcher("`(include-all ,source)", ({ source }, { meta }) => {
    return Stmts.IncludeAll(S.stringContent(source), meta)
  }),

  S.matcher(
    "(cons* 'import source entries)",
    ({ source, entries }, { meta }) => {
      return Stmts.Import(
        S.stringContent(source),
        S.listElements(entries).map(S.symbolContent),
        meta,
      )
    },
  ),

  S.matcher("(cons* 'include source names)", ({ source, names }, { meta }) => {
    return Stmts.Include(
      S.stringContent(source),
      S.listElements(names).map(S.symbolContent),
      meta,
    )
  }),

  S.matcher(
    "(cons* 'import-except source names)",
    ({ source, names }, { meta }) => {
      return Stmts.ImportExcept(
        S.stringContent(source),
        S.listElements(names).map(S.symbolContent),
        meta,
      )
    },
  ),

  S.matcher(
    "(cons* 'include-except source names)",
    ({ source, names }, { meta }) => {
      return Stmts.IncludeExcept(
        S.stringContent(source),
        S.listElements(names).map(S.symbolContent),
        meta,
      )
    },
  ),

  S.matcher("`(import-as ,source ,prefix)", ({ source, prefix }, { meta }) => {
    return Stmts.ImportAs(
      S.stringContent(source),
      S.symbolContent(prefix),
      meta,
    )
  }),

  S.matcher("`(include-as ,source ,prefix)", ({ source, prefix }, { meta }) => {
    return Stmts.IncludeAs(
      S.stringContent(source),
      S.symbolContent(prefix),
      meta,
    )
  }),

  S.matcher("exp", ({ exp }, { meta }) => {
    return Stmts.Compute(parseExp(exp), meta)
  }),
])
