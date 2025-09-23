import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutHashtag(mod: Mod) {
  provide(mod, ["hashtag?", "hashtag-string"])

  definePrimitiveFunction(mod, "hashtag?", 1, (value) => {
    return Values.Bool(Values.isHashtag(value))
  })

  definePrimitiveFunction(mod, "hashtag-string", 1, (value) => {
    return Values.String(Values.asHashtag(value).content)
  })
}
