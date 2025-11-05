import * as X from "@xieyuheng/x-sexp.js"
import * as Exps from "../exp/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { type DataField } from "../value/AboutData.ts"
import { parseExp } from "./parseExp.ts"

export function parseStmt(sexp: X.Sexp): Stmt {
  return X.match(stmtMatcher, sexp)
}

const stmtMatcher: X.Matcher<Stmt> = X.matcherChoice<Stmt>([
  X.matcher(
    "(cons* 'define (cons* name parameters) body)",
    ({ name, parameters, body }, { sexp }) => {
      const keyword = X.asTael(sexp).elements[1]
      const meta = X.tokenMetaFromSexpMeta(keyword.meta)
      if (X.listElements(parameters).length === 0) {
        return Stmts.Define(
          X.symbolContent(name),
          Exps.NullaryLambda(
            Exps.BeginSugar(X.listElements(body).map(parseExp), meta),
            meta,
          ),
          meta,
        )
      } else {
        return Stmts.Define(
          X.symbolContent(name),
          Exps.Lambda(
            X.listElements(parameters).map(parseExp),
            Exps.BeginSugar(X.listElements(body).map(parseExp), meta),
            meta,
          ),
          meta,
        )
      }
    },
  ),

  X.matcher("`(define ,name ,exp)", ({ name, exp }, { meta }) => {
    return Stmts.Define(X.symbolContent(name), parseExp(exp), meta)
  }),

  X.matcher(
    "(cons* 'import source entries)",
    ({ source, entries }, { meta }) => {
      return Stmts.Import(
        X.stringContent(source),
        X.listElements(entries).map(matchImportEntry),
        meta,
      )
    },
  ),

  X.matcher("(cons* 'export names)", ({ names }, { meta }) => {
    return Stmts.Export(X.listElements(names).map(X.symbolContent), meta)
  }),

  X.matcher("`(import-all ,source)", ({ source }, { meta }) => {
    return Stmts.ImportAll(X.stringContent(source), meta)
  }),

  X.matcher("`(import-as ,source ,name)", ({ source, name }, { meta }) => {
    return Stmts.ImportAs(X.stringContent(source), X.symbolContent(name), meta)
  }),

  X.matcher("`(include-all ,source)", ({ source }, { meta }) => {
    return Stmts.IncludeAll(X.stringContent(source), meta)
  }),

  X.matcher("(cons* 'include source names)", ({ source, names }, { meta }) => {
    return Stmts.Include(
      X.stringContent(source),
      X.listElements(names).map(X.symbolContent),
      meta,
    )
  }),

  X.matcher(
    "(cons* 'include-except source names)",
    ({ source, names }, { meta }) => {
      return Stmts.IncludeExcept(
        X.stringContent(source),
        X.listElements(names).map(X.symbolContent),
        meta,
      )
    },
  ),

  X.matcher("`(include-as ,source ,name)", ({ source, name }, { meta }) => {
    return Stmts.IncludeAs(X.stringContent(source), X.symbolContent(name), meta)
  }),

  X.matcher(
    "(cons* 'define-data predicate constructors)",
    ({ predicate, constructors }, { meta }) => {
      return Stmts.DefineData(
        matchDataPredicate(predicate),
        X.listElements(constructors).map(matchDataConstructor),
        meta,
      )
    },
  ),

  X.matcher("`(claim ,name ,schema)", ({ name, schema }, { meta }) => {
    return Stmts.Claim(X.symbolContent(name), parseExp(schema), meta)
  }),

  X.matcher("exp", ({ exp }, { meta }) => {
    return Stmts.Compute(parseExp(exp), meta)
  }),
])

function matchImportEntry(sexp: X.Sexp): Stmts.ImportEntry {
  return X.match(
    X.matcherChoice([
      X.matcher("`(rename ,name ,rename)", ({ name, rename }, { meta }) => {
        return {
          name: X.symbolContent(name),
          rename: X.symbolContent(rename),
          meta,
        }
      }),

      X.matcher("name", ({ name }, { meta }) => {
        return {
          name: X.symbolContent(name),
          meta,
        }
      }),
    ]),
    sexp,
  )
}

function matchDataPredicate(sexp: X.Sexp): Stmts.DataPredicateSpec {
  return X.match(
    X.matcherChoice([
      X.matcher("(cons* name parameters)", ({ name, parameters }, { meta }) => {
        return {
          name: X.symbolContent(name),
          parameters: X.listElements(parameters).map(X.symbolContent),
        }
      }),

      X.matcher("name", ({ name }, { meta }) => {
        return {
          name: X.symbolContent(name),
          parameters: [],
        }
      }),
    ]),
    sexp,
  )
}

function matchDataConstructor(sexp: X.Sexp): Stmts.DataConstructorSpec {
  return X.match(
    X.matcherChoice([
      X.matcher("(cons* name fields)", ({ name, fields }, { meta }) => {
        return {
          name: X.symbolContent(name),
          fields: X.listElements(fields).map(matchDataField),
        }
      }),

      X.matcher("name", ({ name }, { meta }) => {
        return {
          name: X.symbolContent(name),
          fields: [],
        }
      }),
    ]),
    sexp,
  )
}

function matchDataField(sexp: X.Sexp): DataField {
  return X.match(
    X.matcherChoice([
      X.matcher("`(,name ,exp)", ({ name, exp }, { meta }) => {
        return {
          name: X.symbolContent(name),
          predicate: parseExp(exp),
        }
      }),
    ]),
    sexp,
  )
}
