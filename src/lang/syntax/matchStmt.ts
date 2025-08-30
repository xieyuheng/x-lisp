import * as X from "@xieyuheng/x-data.js"
import * as Exps from "../exp/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import type { DataField } from "../value/Data.ts"
import { matchExp } from "./matchExp.ts"

export function matchStmt(data: X.Data): Stmt {
  return X.match(stmtMatcher, data)
}

const stmtMatcher: X.Matcher<Stmt> = X.matcherChoice<Stmt>([
  X.matcher(
    "(cons* 'define (cons* name parameters) body)",
    ({ name, parameters, body }, { data }) => {
      const keyword = X.asTael(data).elements[1]
      const meta = X.tokenMetaFromDataMeta(keyword.meta)

      if (X.dataToArray(parameters).length === 0) {
        return Stmts.Define(
          X.symbolToString(name),
          Exps.Thunk(Exps.Begin(X.dataToArray(body).map(matchExp), meta), meta),
          meta,
        )
      } else {
        return Stmts.Define(
          X.symbolToString(name),
          Exps.Lambda(
            X.dataToArray(parameters).map(X.symbolToString),
            Exps.Begin(X.dataToArray(body).map(matchExp), meta),
            meta,
          ),
          meta,
        )
      }
    },
  ),

  X.matcher(
    "(cons* 'define-lazy (cons* name parameters) body)",
    ({ name, parameters, body }, { data }) => {
      const keyword = X.asTael(data).elements[1]
      const meta = X.tokenMetaFromDataMeta(keyword.meta)

      if (X.dataToArray(parameters).length === 0) {
        return Stmts.Define(
          X.symbolToString(name),
          Exps.Thunk(Exps.Begin(X.dataToArray(body).map(matchExp), meta), meta),
          meta,
        )
      } else {
        return Stmts.Define(
          X.symbolToString(name),
          Exps.LambdaLazy(
            X.dataToArray(parameters).map(X.symbolToString),
            Exps.Begin(X.dataToArray(body).map(matchExp), meta),
            meta,
          ),
          meta,
        )
      }
    },
  ),

  X.matcher("`(define ,name ,exp)", ({ name, exp }, { meta }) => {
    return Stmts.Define(X.symbolToString(name), matchExp(exp), meta)
  }),

  X.matcher(
    "(cons* 'import source entries)",
    ({ source, entries }, { meta }) => {
      return Stmts.Import(
        X.dataToString(source),
        X.dataToArray(entries).map(matchImportEntry),
        meta,
      )
    },
  ),

  X.matcher("`(import-all ,source)", ({ source }, { meta }) => {
    return Stmts.ImportAll(X.dataToString(source), meta)
  }),

  X.matcher("`(import-as ,source ,name)", ({ source, name }, { meta }) => {
    return Stmts.ImportAs(X.dataToString(source), X.symbolToString(name), meta)
  }),

  X.matcher("`(include-all ,source)", ({ source }, { meta }) => {
    return Stmts.IncludeAll(X.dataToString(source), meta)
  }),

  X.matcher("(cons* 'include source names)", ({ source, names }, { meta }) => {
    return Stmts.Include(
      X.dataToString(source),
      X.dataToArray(names).map(X.symbolToString),
      meta,
    )
  }),

  X.matcher(
    "(cons* 'include-except source names)",
    ({ source, names }, { meta }) => {
      return Stmts.IncludeExcept(
        X.dataToString(source),
        X.dataToArray(names).map(X.symbolToString),
        meta,
      )
    },
  ),

  X.matcher("`(include-as ,source ,name)", ({ source, name }, { meta }) => {
    return Stmts.IncludeAs(X.dataToString(source), X.symbolToString(name), meta)
  }),

  X.matcher(
    "(cons* 'define-data predicate constructors)",
    ({ predicate, constructors }, { meta }) => {
      return Stmts.DefineData(
        matchDataPredicate(predicate),
        X.dataToArray(constructors).map(matchDataConstructor),
        meta,
      )
    },
  ),

  X.matcher("`(claim ,name ,schema)", ({ name, schema }, { meta }) => {
    return Stmts.Claim(X.symbolToString(name), matchExp(schema), meta)
  }),

  X.matcher("exp", ({ exp }, { meta }) => {
    return Stmts.Compute(matchExp(exp), meta)
  }),
])

function matchImportEntry(data: X.Data): Stmts.ImportEntry {
  return X.match(
    X.matcherChoice([
      X.matcher("`(rename ,name ,rename)", ({ name, rename }, { meta }) => {
        return {
          name: X.symbolToString(name),
          rename: X.symbolToString(rename),
          meta,
        }
      }),

      X.matcher("name", ({ name }, { meta }) => {
        return {
          name: X.symbolToString(name),
          meta,
        }
      }),
    ]),
    data,
  )
}

function matchDataPredicate(data: X.Data): Stmts.DataPredicateSpec {
  return X.match(
    X.matcherChoice([
      X.matcher("(cons* name parameters)", ({ name, parameters }, { meta }) => {
        return {
          name: X.symbolToString(name),
          parameters: X.dataToArray(parameters).map(X.symbolToString),
        }
      }),

      X.matcher("name", ({ name }, { meta }) => {
        return {
          name: X.symbolToString(name),
          parameters: [],
        }
      }),
    ]),
    data,
  )
}

function matchDataConstructor(data: X.Data): Stmts.DataConstructorSpec {
  return X.match(
    X.matcherChoice([
      X.matcher("(cons* name fields)", ({ name, fields }, { meta }) => {
        return {
          name: X.symbolToString(name),
          fields: X.dataToArray(fields).map(matchDataField),
        }
      }),

      X.matcher("name", ({ name }, { meta }) => {
        return {
          name: X.symbolToString(name),
          fields: [],
        }
      }),
    ]),
    data,
  )
}

function matchDataField(data: X.Data): DataField {
  return X.match(
    X.matcherChoice([
      X.matcher("`(,name ,exp)", ({ name, exp }, { meta }) => {
        return {
          name: X.symbolToString(name),
          predicate: matchExp(exp),
        }
      }),
    ]),
    data,
  )
}
