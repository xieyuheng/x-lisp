import { pathRelativeToCwd } from "@xieyuheng/helpers.js/path"
import fs from "node:fs"
import Path from "node:path"
import * as M from "../index.ts"

export function importBy(path: string, mod: M.Mod): M.Mod {
  path = pathRelativeToMod(path, mod)
  path = resolveModPath(path)
  return M.loadMod(path, mod.dependencyGraph)
}

function pathRelativeToMod(path: string, mod: M.Mod): string {
  path = Path.resolve(Path.dirname(mod.name), path)
  if (path === mod.name) {
    let message = `[urlRelativeToMod] A module can not import itself: ${path}`
    throw new Error(message)
  }

  return path
}

function resolveModPath(inputPath: string): string {
  let path = inputPath
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    path = `${path}/index.meta`
  }

  if (Path.extname(path) === "") {
    path = `${path}.meta`
  }

  if (!fs.existsSync(path)) {
    let message = `[resolveModPath] resolved path does not exist as a file`
    message += `\n  input path: ${pathRelativeToCwd(path)}`
    message += `\n  resolved path: ${pathRelativeToCwd(path)}`
    throw new Error(message)
  }

  return path
}
