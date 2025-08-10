import * as X from "@xieyuheng/x-data.js"
import { definePrimitiveFunction } from "../define/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutSexp(mod: Mod) {
  definePrimitiveFunction(mod, "parse-sexp", 1, (x) =>
    X.parseData(Values.asString(x).content),
  )

  definePrimitiveFunction(mod, "parse-sexps", 1, (x) =>
    Values.List(X.parseDataArray(Values.asString(x).content)),
  )

  definePrimitiveFunction(mod, "format-sexp", 1, (x) => {
    if (Values.isSexp(x)) {
      return Values.String(Values.formatSexp(x))
    } else {
      let message = `(format-sexp) expect argument to be sexp\n`
      message += `  argument: ${formatValue(x)}`
      throw new Error(message)
    }
  })
}
