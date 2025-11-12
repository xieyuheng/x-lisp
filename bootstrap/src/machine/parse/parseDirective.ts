import * as S from "@xieyuheng/x-sexp.js"
import * as Directives from "../directive/index.ts"
import { type Directive } from "../directive/index.ts"

export function parseDirective(sexp: S.Sexp): Directive {
  return S.match(
    S.matcherChoice<Directive>([
      S.matcher("(cons* 'db values)", ({ values }, { meta }) => {
        return Directives.Db(S.listElements(values).map(S.numberContent), meta)
      }),

      S.matcher("(cons* 'dw values)", ({ values }, { meta }) => {
        return Directives.Dw(S.listElements(values).map(S.numberContent), meta)
      }),

      S.matcher("(cons* 'dd values)", ({ values }, { meta }) => {
        return Directives.Dd(S.listElements(values).map(S.numberContent), meta)
      }),

      S.matcher("(cons* 'dq values)", ({ values }, { meta }) => {
        return Directives.Dq(S.listElements(values).map(S.numberContent), meta)
      }),
    ]),
    sexp,
  )
}
