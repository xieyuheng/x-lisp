import { stringHasBlank } from "../../utils/string/stringHasBlank.ts"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutString(mod: Mod) {
  provide(mod, [
    "string?",
    "string-length",
    "string-to-symbol",
    "string-append",
    "string-append-many",
    "string-join",
    "string-chars",
    "string-replace-first",
    "string-replace",
  ])

  definePrimitiveFunction(mod, "string?", 1, (value) => {
    return Values.Bool(Values.isString(value))
  })

  definePrimitiveFunction(mod, "string-length", 1, (string) => {
    return Values.Int(Values.asString(string).content.length)
  })

  definePrimitiveFunction(mod, "string-to-symbol", 1, (string) => {
    if (stringHasBlank(Values.asString(string).content)) {
      let message = `(string-to-symbol) symbol can not have black chars\n`
      message += `  string: "${Values.asString(string).content}"\n`
      throw new Error(message)
    }

    return Values.Symbol(Values.asString(string).content)
  })

  definePrimitiveFunction(mod, "string-append", 2, (left, right) => {
    return Values.String(
      Values.asString(left).content + Values.asString(right).content,
    )
  })

  definePrimitiveFunction(mod, "string-append-many", 1, (list) => {
    return Values.String(
      Values.asTael(list)
        .elements.map((string) => Values.asString(string).content)
        .join(""),
    )
  })

  definePrimitiveFunction(mod, "string-join", 2, (separator, list) => {
    return Values.String(
      Values.asTael(list)
        .elements.map((string) => Values.asString(string).content)
        .join(Values.asString(separator).content),
    )
  })

  definePrimitiveFunction(mod, "string-chars", 1, (string) => {
    return Values.List(
      Values.asString(string).content.split("").map(Values.String),
    )
  })

  definePrimitiveFunction(
    mod,
    "string-replace-first",
    3,
    (pattern, replacement, string) => {
      return Values.String(
        Values.asString(string).content.replace(
          Values.asString(pattern).content,
          Values.asString(replacement).content,
        ),
      )
    },
  )

  definePrimitiveFunction(
    mod,
    "string-replace",
    3,
    (pattern, replacement, string) => {
      return Values.String(
        Values.asString(string).content.replaceAll(
          Values.asString(pattern).content,
          Values.asString(replacement).content,
        ),
      )
    },
  )
}
