import { definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutString(mod: Mod) {
  definePrimitiveFunction(mod, "string?", 1, (value) => {
    return Values.Bool(Values.isString(value))
  })

  definePrimitiveFunction(mod, "string-length", 1, (string) => {
    return Values.Int(Values.asString(string).content.length)
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
}
