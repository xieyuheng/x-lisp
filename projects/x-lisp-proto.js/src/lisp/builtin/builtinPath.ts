import Path from "node:path"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinPath(mod: Mod) {
  provide(mod, ["path-join"])

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
