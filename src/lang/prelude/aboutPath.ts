import Path from "node:path"
import { definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutPath(mod: Mod) {
  definePrimitiveFunction(mod, "path-join", 1, (list) => {
    return Values.String(
      Path.join(
        ...Values.asTael(list).elements.map(
          (element) => Values.asString(element).content,
        ),
      ),
    )
  })
}
