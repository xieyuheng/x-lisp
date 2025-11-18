import * as S from "@xieyuheng/x-sexp.js"
import * as Exps from "../exp/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { type DataField } from "../value/AboutData.ts"
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
  ),

  S.matcher("`(define ,name ,exp)", ({ name, exp }, { meta }) => {
    return Stmts.Define(S.symbolContent(name), parseExp(exp), meta)
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

  S.matcher(
    "(cons* 'define-data predicate constructors)",
    ({ predicate, constructors }, { meta }) => {
      return Stmts.DefineData(
        matchDataPredicate(predicate),
        S.listElements(constructors).map(matchDataConstructor),
        meta,
      )
    },
  ),

  S.matcher("`(claim ,name ,schema)", ({ name, schema }, { meta }) => {
    return Stmts.Claim(S.symbolContent(name), parseExp(schema), meta)
  }),

  S.matcher("exp", ({ exp }, { meta }) => {
    return Stmts.Compute(parseExp(exp), meta)
  }),
])

function matchDataPredicate(sexp: S.Sexp): Stmts.DataPredicateSpec {
  return S.match(
    S.matcherChoice([
      S.matcher("(cons* name parameters)", ({ name, parameters }, { meta }) => {
        return {
          name: S.symbolContent(name),
          parameters: S.listElements(parameters).map(S.symbolContent),
        }
      }),

      S.matcher("name", ({ name }, { meta }) => {
        return {
          name: S.symbolContent(name),
          parameters: [],
        }
      }),
    ]),
    sexp,
  )
}

function matchDataConstructor(sexp: S.Sexp): Stmts.DataConstructorSpec {
  return S.match(
    S.matcherChoice([
      S.matcher("(cons* name fields)", ({ name, fields }, { meta }) => {
        return {
          name: S.symbolContent(name),
          fields: S.listElements(fields).map(matchDataField),
        }
      }),

      S.matcher("name", ({ name }, { meta }) => {
        return {
          name: S.symbolContent(name),
          fields: [],
        }
      }),
    ]),
    sexp,
  )
}

function matchDataField(sexp: S.Sexp): DataField {
  return S.match(
    S.matcherChoice([
      S.matcher("`(,name ,exp)", ({ name, exp }, { meta }) => {
        return {
          name: S.symbolContent(name),
          predicate: parseExp(exp),
        }
      }),
    ]),
    sexp,
  )
}
