import { createUrl, pathRelativeToCwd } from "@xieyuheng/helpers.js/url"
import fs from "node:fs"
import Path from "node:path"
import { suffix } from "../config.ts"
import * as L from "../index.ts"

export function importBy(path: string, mod: L.Mod): L.Mod {
  let url = urlRelativeToMod(path, mod)
  if (url.protocol === "file:") {
    url.pathname = resolveModPath(url.pathname)
  }

  return L.loadMod(url, mod.dependencyGraph)
}

function urlRelativeToMod(path: string, mod: L.Mod): URL {
  if (mod.url.protocol === "file:") {
    const url = new URL(path, mod.url)
    if (url.href === mod.url.href) {
      let message = `[urlRelativeToMod] A module can not import itself: ${path}`
      throw new Error(message)
    }

    return url
  }

  return createUrl(path)
}

function resolveModPath(inputPath: string): string {
  let path = inputPath
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    path = `${path}/index${suffix}`
  }

  if (Path.extname(path) === "") {
    path = `${path}${suffix}`
  }

  if (!fs.existsSync(path)) {
    let message = `[resolveModPath] resolved path does not exist as a file`
    message += `\n  input path: ${pathRelativeToCwd(path)}`
    message += `\n  resolved path: ${pathRelativeToCwd(path)}`
    throw new Error(message)
  }

  return path
}
