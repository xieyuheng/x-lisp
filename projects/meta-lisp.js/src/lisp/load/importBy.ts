import { pathRelativeToCwd } from "@xieyuheng/helpers.js/path"
import fs from "node:fs"
import Path from "node:path"
import * as L from "../index.ts"

export function importBy(path: string, mod: L.Mod): L.Mod {
  path = pathRelativeToMod(path, mod)
  path = resolveModPath(path)
  return L.loadMod(path, mod.dependencyGraph)
}

function pathRelativeToMod(path: string, mod: L.Mod): string {
  path = Path.resolve(Path.dirname(mod.path), path)
  if (path === mod.path) {
    let message = `[urlRelativeToMod] A module can not import itself: ${path}`
    throw new Error(message)
  }

  return path
}

function resolveModPath(inputPath: string): string {
  let path = inputPath
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    path = `${path}/index.lisp`
  }

  if (Path.extname(path) === "") {
    path = `${path}.lisp`
  }

  if (!fs.existsSync(path)) {
    let message = `[resolveModPath] resolved path does not exist as a file`
    message += `\n  input path: ${pathRelativeToCwd(path)}`
    message += `\n  resolved path: ${pathRelativeToCwd(path)}`
    throw new Error(message)
  }

  return path
}
