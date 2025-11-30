import * as S from "@xieyuheng/sexp.js"
import * as Directives from "../directive/index.ts"
import { type Directive } from "../directive/index.ts"

export function parseDirective(sexp: S.Sexp): Directive {
  return S.match(
    S.matcherChoice<Directive>([
      S.matcher("(cons* 'db values)", ({ values }, { meta }) => {
        return Directives.Db(
          S.listElements(values).map((value) => BigInt(S.numberContent(value))),
          meta,
        )
      }),

      S.matcher("(cons* 'dw values)", ({ values }, { meta }) => {
        return Directives.Dw(
          S.listElements(values).map((value) => BigInt(S.numberContent(value))),
          meta,
        )
      }),

      S.matcher("(cons* 'dd values)", ({ values }, { meta }) => {
        return Directives.Dd(
          S.listElements(values).map((value) => BigInt(S.numberContent(value))),
          meta,
        )
      }),

      S.matcher("(cons* 'dq values)", ({ values }, { meta }) => {
        return Directives.Dq(
          S.listElements(values).map((value) => BigInt(S.numberContent(value))),
          meta,
        )
      }),

      S.matcher("`(string ,content)", ({ content }, { meta }) => {
        return Directives.String(S.stringContent(content), meta)
      }),

      S.matcher("`(int ,content)", ({ content }, { meta }) => {
        return Directives.Int(BigInt(S.numberContent(content)), meta)
      }),

      S.matcher("`(float ,content)", ({ content }, { meta }) => {
        return Directives.Float(S.numberContent(content), meta)
      }),

      S.matcher("`(pointer ,name)", ({ name }, { meta }) => {
        return Directives.Pointer(S.symbolContent(name), meta)
      }),
    ]),
    sexp,
  )
}
