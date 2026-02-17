import * as S from "@xieyuheng/sexp.js"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { formatSexp } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinSexp(mod: Mod) {
  provide(mod, ["sexp?", "parse-sexp", "parse-sexps", "format-sexp"])

  definePrimitiveFunction(mod, "sexp?", 1, (value) => {
    return Values.BoolValue(Values.isSexpValue(value))
  })

  definePrimitiveFunction(mod, "parse-sexp", 1, (string) => {
    return S.parseSexp(Values.asStringValue(string).content)
  })

  definePrimitiveFunction(mod, "parse-sexps", 1, (string) => {
    return Values.ListValue(S.parseSexps(Values.asStringValue(string).content))
  })

  definePrimitiveFunction(mod, "format-sexp", 1, (sexp) => {
    return Values.StringValue(formatSexp(sexp))
  })
}
