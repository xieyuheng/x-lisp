import * as X from "@xieyuheng/x-data.js"
import * as Exps from "../exp/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import type { DataField } from "../value/Data.ts"
import { matchExp } from "./matchExp.ts"

const stmtMatcher: X.Matcher<Stmt> = X.matcherChoice<Stmt>([
  X.matcher(
    "(cons* 'define (cons* name parameters) body)",
    ({ name, parameters, body }, { span }) => {
      if (X.dataToArray(parameters).length === 0) {
        return Stmts.Define(
          X.symbolToString(name),
          Exps.Thunk(Exps.Begin(X.dataToArray(body).map(matchExp), { span }), {
            span,
          }),
          { span },
        )
      } else {
        return Stmts.Define(
          X.symbolToString(name),
          Exps.Lambda(
            X.dataToArray(parameters).map(X.symbolToString),
            Exps.Begin(X.dataToArray(body).map(matchExp), { span }),
            { span },
          ),
          { span },
        )
      }
    },
  ),

  X.matcher("`(define ,name ,exp)", ({ name, exp }, { span }) => {
    return Stmts.Define(X.symbolToString(name), matchExp(exp), { span })
  }),

  X.matcher(
    "(cons* 'import source entries)",
    ({ source, entries }, { span }) => {
      return Stmts.Import(
        X.dataToString(source),
        X.dataToArray(entries).map(matchImportEntry),
        { span },
      )
    },
  ),

  X.matcher("`(import-all ,source)", ({ source }, { span }) => {
    return Stmts.ImportAll(X.dataToString(source), { span })
  }),

  X.matcher("`(include ,source)", ({ source }, { span }) => {
    return Stmts.Include(X.dataToString(source), { span })
  }),

  X.matcher(
    "(cons* 'include-only source names)",
    ({ source, names }, { span }) => {
      return Stmts.IncludeOnly(
        X.dataToString(source),
        X.dataToArray(names).map(X.symbolToString),
        { span },
      )
    },
  ),

  X.matcher(
    "(cons* 'include-except source names)",
    ({ source, names }, { span }) => {
      return Stmts.IncludeExcept(
        X.dataToString(source),
        X.dataToArray(names).map(X.symbolToString),
        { span },
      )
    },
  ),

  X.matcher(
    "(cons* 'define-data predicate constructors)",
    ({ predicate, constructors }, { span }) => {
      return Stmts.DefineData(
        matchDataPredicate(predicate),
        X.dataToArray(constructors).map(matchDataConstructor),
        { span },
      )
    },
  ),

  X.matcher("`(claim ,name ,schema)", ({ name, schema }, { span }) => {
    return Stmts.Claim(X.symbolToString(name), matchExp(schema), { span })
  }),

  X.matcher("exp", ({ exp }, { span }) => {
    return Stmts.Compute(matchExp(exp), { span })
  }),
])

export function matchStmt(data: X.Data): Stmt {
  return X.match(stmtMatcher, data)
}

function matchImportEntry(data: X.Data): Stmts.ImportEntry {
  return X.match(
    X.matcherChoice([
      X.matcher("`(rename ,name ,rename)", ({ name, rename }, { span }) => {
        return {
          name: X.symbolToString(name),
          rename: X.symbolToString(rename),
          meta: { span },
        }
      }),

      X.matcher("name", ({ name }, { span }) => {
        return {
          name: X.symbolToString(name),
          meta: { span },
        }
      }),
    ]),
    data,
  )
}

function matchDataPredicate(data: X.Data): Stmts.DataPredicateSpec {
  return X.match(
    X.matcherChoice([
      X.matcher("(cons* name parameters)", ({ name, parameters }, { span }) => {
        return {
          name: X.symbolToString(name),
          parameters: X.dataToArray(parameters).map(X.symbolToString),
        }
      }),

      X.matcher("name", ({ name }, { span }) => {
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
      X.matcher("(cons* name fields)", ({ name, fields }, { span }) => {
        return {
          name: X.symbolToString(name),
          fields: X.dataToArray(fields).map(matchDataField),
        }
      }),

      X.matcher("name", ({ name }, { span }) => {
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
      X.matcher("`(,name ,exp)", ({ name, exp }, { span }) => {
        return {
          name: X.symbolToString(name),
          predicate: matchExp(exp),
        }
      }),
    ]),
    data,
  )
}
