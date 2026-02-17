import { stringHasBlank } from "@xieyuheng/helpers.js/string"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinString(mod: Mod) {
  provide(mod, [
    "string?",
    "string-length",
    "string-to-symbol",
    "string-append",
    "string-concat",
    "string-join",
    "string-split",
    "string-lines",
    "string-chars",
    "string-replace-first",
    "string-replace",
    "string-compare-lexical",
  ])

  definePrimitiveFunction(mod, "string?", 1, (value) => {
    return Values.BoolValue(Values.isStringValue(value))
  })

  definePrimitiveFunction(mod, "string-length", 1, (string) => {
    return Values.IntValue(BigInt(Values.asStringValue(string).content.length))
  })

  definePrimitiveFunction(mod, "string-to-symbol", 1, (string) => {
    if (stringHasBlank(Values.asStringValue(string).content)) {
      let message = `(string-to-symbol) symbol can not have black chars`
      message += `\n  string: "${Values.asStringValue(string).content}"`
      throw new Error(message)
    }

    return Values.SymbolValue(Values.asStringValue(string).content)
  })

  definePrimitiveFunction(mod, "string-append", 2, (left, right) => {
    return Values.StringValue(
      Values.asStringValue(left).content + Values.asStringValue(right).content,
    )
  })

  definePrimitiveFunction(mod, "string-concat", 1, (list) => {
    return Values.StringValue(
      Values.asTaelValue(list)
        .elements.map((string) => Values.asStringValue(string).content)
        .join(""),
    )
  })

  definePrimitiveFunction(mod, "string-join", 2, (separator, list) => {
    return Values.StringValue(
      Values.asTaelValue(list)
        .elements.map((string) => Values.asStringValue(string).content)
        .join(Values.asStringValue(separator).content),
    )
  })

  definePrimitiveFunction(mod, "string-split", 2, (separator, string) => {
    return Values.ListValue(
      Values.asStringValue(string)
        .content.split(Values.asStringValue(separator).content)
        .map(Values.StringValue),
    )
  })

  definePrimitiveFunction(mod, "string-lines", 1, (string) => {
    return Values.ListValue(
      Values.asStringValue(string).content.split("\n").map(Values.StringValue),
    )
  })

  definePrimitiveFunction(mod, "string-chars", 1, (string) => {
    return Values.ListValue(
      Values.asStringValue(string).content.split("").map(Values.StringValue),
    )
  })

  definePrimitiveFunction(
    mod,
    "string-replace-first",
    3,
    (pattern, replacement, string) => {
      return Values.StringValue(
        Values.asStringValue(string).content.replace(
          Values.asStringValue(pattern).content,
          Values.asStringValue(replacement).content,
        ),
      )
    },
  )

  definePrimitiveFunction(
    mod,
    "string-replace",
    3,
    (pattern, replacement, string) => {
      return Values.StringValue(
        Values.asStringValue(string).content.replaceAll(
          Values.asStringValue(pattern).content,
          Values.asStringValue(replacement).content,
        ),
      )
    },
  )

  definePrimitiveFunction(mod, "string-compare-lexical", 2, (x, y) => {
    if (Values.asStringValue(x).content < Values.asStringValue(y).content) {
      return Values.IntValue(-1n)
    } else if (
      Values.asStringValue(x).content > Values.asStringValue(y).content
    ) {
      return Values.IntValue(1n)
    } else {
      return Values.IntValue(0n)
    }
  })
}
