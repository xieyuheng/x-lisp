import { definePrimFn } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export async function aboutList(mod: Mod) {
  definePrimFn(mod, "null?", 1, (x) =>
    Values.Bool(Values.asTael(x).elements.length === 0),
  )

  definePrimFn(mod, "car", 1, (x) => {
    if (Values.asTael(x).elements.length === 0) {
      throw new Error("[car] expect target to be non empty list")
    }

    return Values.asTael(x).elements[0]
  })

  definePrimFn(mod, "cdr", 1, (x) => {
    if (Values.asTael(x).elements.length === 0) {
      throw new Error("[cdr] expect target to be non empty list")
    }

    return Values.Tael(
      Values.asTael(x).elements.slice(1),
      Values.asTael(x).attributes,
    )
  })

  definePrimFn(mod, "cons", 2, (head, tail) => {
    return Values.Tael(
      [head, ...Values.asTael(tail).elements],
      Values.asTael(tail).attributes,
    )
  })

  definePrimFn(mod, "list-length", 1, (x) =>
    Values.Int(Values.asTael(x).elements.length),
  )

  definePrimFn(mod, "list-append", 2, (x, y) =>
    Values.Tael(
      [...Values.asTael(x).elements, ...Values.asTael(y).elements],
      Values.asTael(x).attributes,
    ),
  )

  definePrimFn(mod, "list-of", 1, (x) =>
    Values.List([...Values.asTael(x).elements]),
  )
}
