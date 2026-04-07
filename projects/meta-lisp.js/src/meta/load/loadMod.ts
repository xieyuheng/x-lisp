import {
  callWithFile,
  fileRead,
  openInputFile,
} from "@xieyuheng/helpers.js/file"
import * as M from "../index.ts"

export function loadMod(path: string, project: M.Project): M.Mod {
  const found = M.projectLookupMod(project, path)
  if (found !== undefined) return found

  const mod = M.createMod(path, project)
  M.projectAddMod(project, mod)

  const builtinMod = M.loadBuiltinMod(project)
  for (const definition of builtinMod.definitions.values()) {
    M.modDefine(mod, definition.name, definition)
  }

  callWithFile(openInputFile(path), (file) => {
    const code = fileRead(file)
    M.prepareCode(mod, code)
  })

  return mod
}
