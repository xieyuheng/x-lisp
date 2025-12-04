import * as S from "@xieyuheng/sexp.js"
import * as Directives from "../directive/index.ts"
import { type Directive } from "../directive/index.ts"

export const parseDirective = S.createRouter<Directive>({
  "(cons* 'db values)": ({ values }, { meta }) => {
    return Directives.Db(
      S.listElements(values).map((value) => S.intContent(value)),
      meta,
    )
  },

  "(cons* 'dw values)": ({ values }, { meta }) => {
    return Directives.Dw(
      S.listElements(values).map((value) => S.intContent(value)),
      meta,
    )
  },

  "(cons* 'dd values)": ({ values }, { meta }) => {
    return Directives.Dd(
      S.listElements(values).map((value) => S.intContent(value)),
      meta,
    )
  },

  "(cons* 'dq values)": ({ values }, { meta }) => {
    return Directives.Dq(
      S.listElements(values).map((value) => S.intContent(value)),
      meta,
    )
  },

  "`(string ,content)": ({ content }, { meta }) => {
    return Directives.String(S.stringContent(content), meta)
  },

  "`(int ,content)": ({ content }, { meta }) => {
    return Directives.Int(S.intContent(content), meta)
  },

  "`(float ,content)": ({ content }, { meta }) => {
    return Directives.Float(S.floatContent(content), meta)
  },

  "`(pointer ,name)": ({ name }, { meta }) => {
    return Directives.Pointer(S.symbolContent(name), meta)
  },
})
