import * as S from "@xieyuheng/sexp.js"
import * as Exps from "../exp/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { type DataField } from "../value/AboutData.ts"
import { parseExp } from "./parseExp.ts"

export const parseStmt = S.createRouter<Stmt>({
  "(cons* 'define (cons* name parameters) body)": (
    { name, parameters, body },
    { sexp },
  ) => {
    const keyword = S.asTael(sexp).elements[1]
    const meta = S.tokenMetaFromSexpMeta(keyword.meta)
    if (S.listElements(parameters).length === 0) {
      return Stmts.Define(
        S.symbolContent(name),
        Exps.NullaryLambda(
          Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
          meta,
        ),
        meta,
      )
    } else {
      return Stmts.Define(
        S.symbolContent(name),
        Exps.Lambda(
          S.listElements(parameters).map(parseExp),
          Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
          meta,
        ),
        meta,
      )
    }
  },

  "`(define ,name ,exp)": ({ name, exp }, { meta }) => {
    return Stmts.Define(S.symbolContent(name), parseExp(exp), meta)
  },

  "(cons* 'import source entries)": ({ source, entries }, { meta }) => {
    return Stmts.Import(
      S.stringContent(source),
      S.listElements(entries).map(S.symbolContent),
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
  "(cons* 'define-data predicate constructors)": (
    { predicate, constructors },
    { meta },
  ) => {
    return Stmts.DefineData(
      parseDataPredicate(predicate),
      S.listElements(constructors).map(parseDataConstructor),
      meta,
    )
  },
  "`(claim ,name ,schema)": ({ name, schema }, { meta }) => {
    return Stmts.Claim(S.symbolContent(name), parseExp(schema), meta)
  },

  exp: ({ exp }, { meta }) => {
    return Stmts.Compute(parseExp(exp), meta)
  },
})

const parseDataPredicate = S.createRouter<Stmts.DataPredicateSpec>({
  "(cons* name parameters)": ({ name, parameters }, { meta }) => {
    return {
      name: S.symbolContent(name),
      parameters: S.listElements(parameters).map(S.symbolContent),
    }
  },

  name: ({ name }, { meta }) => {
    return {
      name: S.symbolContent(name),
      parameters: [],
    }
  },
})

const parseDataConstructor = S.createRouter<Stmts.DataConstructorSpec>({
  "(cons* name fields)": ({ name, fields }, { meta }) => {
    return {
      name: S.symbolContent(name),
      fields: S.listElements(fields).map(parseDataField),
    }
  },

  name: ({ name }, { meta }) => {
    return {
      name: S.symbolContent(name),
      fields: [],
    }
  },
})

const parseDataField = S.createRouter<DataField>({
  "`(,name ,exp)": ({ name, exp }, { meta }) => {
    return {
      name: S.symbolContent(name),
      predicate: parseExp(exp),
    }
  },
})
