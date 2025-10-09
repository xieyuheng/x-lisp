import * as X from "@xieyuheng/x-data.js"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { formatSexp, formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutSexp(mod: Mod) {
  provide(mod, ["sexp?", "parse-sexp", "parse-sexps", "format-sexp"])

  definePrimitiveFunction(mod, "sexp?", 1, (value) => {
    return Values.Bool(Values.isSexp(value))
  })

  definePrimitiveFunction(mod, "parse-sexp", 1, (string) => {
    return X.parseData(Values.asString(string).content)
  })

  definePrimitiveFunction(mod, "parse-sexps", 1, (string) => {
    return Values.List(X.parseDataArray(Values.asString(string).content))
  })

  definePrimitiveFunction(mod, "format-sexp", 1, (sexp) => {
    if (Values.isSexp(sexp)) {
      return Values.String(formatSexp(sexp))
    } else {
      let message = `(format-sexp) expect argument to be sexp\n`
      message += `  argument: ${formatValue(sexp)}`
      throw new Error(message)
    }
  })
}
