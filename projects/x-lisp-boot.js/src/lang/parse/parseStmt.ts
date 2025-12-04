import * as S from "@xieyuheng/sexp.js"
import * as Exps from "../exp/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { parseExp } from "./parseExp.ts"

export const parseStmt = S.createRouter<Stmt>({
  "(cons* 'define (cons* name parameters) body)": (
    { name, parameters, body },
    { sexp },
  ) => {
    const keyword = S.asTael(sexp).elements[1]
    const meta = S.tokenMetaFromSexpMeta(keyword.meta)
    return Stmts.DefineFunction(
      S.symbolContent(name),
      S.listElements(parameters).map(S.symbolContent),
      Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
      meta,
    )
  },

  "(cons* 'define name body)": ({ name, body }, { sexp }) => {
    const keyword = S.asTael(sexp).elements[1]
    const meta = S.tokenMetaFromSexpMeta(keyword.meta)
    return Stmts.DefineConstant(
      S.symbolContent(name),
      Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
      meta,
    )
  },

  "(cons* 'export names)": ({ names }, { meta }) => {
    return Stmts.Export(S.listElements(names).map(S.symbolContent), meta)
  },

  "`(import-all ,source)": ({ source }, { meta }) => {
    return Stmts.ImportAll(S.stringContent(source), meta)
  },

  "`(include-all ,source)": ({ source }, { meta }) => {
    return Stmts.IncludeAll(S.stringContent(source), meta)
  },

  "(cons* 'import source entries)": ({ source, entries }, { meta }) => {
    return Stmts.Import(
      S.stringContent(source),
      S.listElements(entries).map(S.symbolContent),
      meta,
    )
  },

  "(cons* 'include source names)": ({ source, names }, { meta }) => {
    return Stmts.Include(
      S.stringContent(source),
      S.listElements(names).map(S.symbolContent),
      meta,
    )
  },

  "(cons* 'import-except source names)": ({ source, names }, { meta }) => {
    return Stmts.ImportExcept(
      S.stringContent(source),
      S.listElements(names).map(S.symbolContent),
      meta,
    )
  },

  "(cons* 'include-except source names)": ({ source, names }, { meta }) => {
    return Stmts.IncludeExcept(
      S.stringContent(source),
      S.listElements(names).map(S.symbolContent),
      meta,
    )
  },

  "`(import-as ,source ,prefix)": ({ source, prefix }, { meta }) => {
    return Stmts.ImportAs(
      S.stringContent(source),
      S.symbolContent(prefix),
      meta,
    )
  },

  "`(include-as ,source ,prefix)": ({ source, prefix }, { meta }) => {
    return Stmts.IncludeAs(
      S.stringContent(source),
      S.symbolContent(prefix),
      meta,
    )
  },

  exp: ({ exp }, { meta }) => {
    return Stmts.Compute(parseExp(exp), meta)
  },
})
