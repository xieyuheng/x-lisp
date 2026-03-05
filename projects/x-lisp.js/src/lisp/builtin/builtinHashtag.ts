import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinHashtag(mod: Mod) {
  provide(mod, ["hashtag?", "hashtag-to-string", "hashtag-append"])

  definePrimitiveFunction(mod, "hashtag?", 1, (value) => {
    return Values.BoolValue(Values.isHashtagValue(value))
  })

  definePrimitiveFunction(mod, "hashtag-to-string", 1, (value) => {
    return Values.StringValue(Values.asHashtagValue(value).content)
  })

  definePrimitiveFunction(mod, "hashtag-append", 2, (left, right) => {
    return Values.HashtagValue(
      Values.asHashtagValue(left).content +
        Values.asHashtagValue(right).content,
    )
  })
}
