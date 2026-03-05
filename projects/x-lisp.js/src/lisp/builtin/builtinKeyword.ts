import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinKeyword(mod: Mod) {
  provide(mod, ["keyword?", "keyword-to-string", "keyword-append"])

  definePrimitiveFunction(mod, "keyword?", 1, (value) => {
    return Values.BoolValue(Values.isKeywordValue(value))
  })

  definePrimitiveFunction(mod, "keyword-to-string", 1, (value) => {
    return Values.StringValue(Values.asKeywordValue(value).content)
  })

  definePrimitiveFunction(mod, "keyword-append", 2, (left, right) => {
    return Values.KeywordValue(
      Values.asKeywordValue(left).content +
        Values.asKeywordValue(right).content,
    )
  })
}
