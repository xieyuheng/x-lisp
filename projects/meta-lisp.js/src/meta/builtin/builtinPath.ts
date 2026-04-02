import Path from "node:path"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import * as M from "../index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinPath(mod: Mod) {
  provide(mod, [
    "path-base-name",
    "path-directory-name",
    "path-extension",
    "path-stem",
    "path-absolute?",
    "path-relative?",
    "path-join",
    "path-normalize",
  ])

  definePrimitiveFunction(mod, "path-base-name", 1, (path) => {
    return M.StringValue(Path.basename(M.asStringValue(path).content))
  })

  definePrimitiveFunction(mod, "path-directory-name", 1, (path) => {
    return M.StringValue(Path.dirname(M.asStringValue(path).content))
  })

  definePrimitiveFunction(mod, "path-extension", 1, (path) => {
    return M.StringValue(Path.extname(M.asStringValue(path).content))
  })

  definePrimitiveFunction(mod, "path-stem", 1, (path) => {
    return M.StringValue(Path.parse(M.asStringValue(path).content).name)
  })

  definePrimitiveFunction(mod, "path-absolute?", 1, (path) => {
    return M.BoolValue(Path.isAbsolute(M.asStringValue(path).content))
  })

  definePrimitiveFunction(mod, "path-relative?", 1, (path) => {
    return M.BoolValue(!Path.isAbsolute(M.asStringValue(path).content))
  })

  definePrimitiveFunction(mod, "path-join", 2, (left, right) => {
    return M.StringValue(
      Path.join(M.asStringValue(left).content, M.asStringValue(right).content),
    )
  })

  definePrimitiveFunction(mod, "path-normalize", 1, (path) => {
    return M.StringValue(Path.normalize(M.asStringValue(path).content))
  })
}
