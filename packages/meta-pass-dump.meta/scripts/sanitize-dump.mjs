import { readFileSync, writeFileSync } from "node:fs"
import { relative, dirname, sep } from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const pkgDir = dirname(scriptDir)
const projectRoot = dirname(dirname(pkgDir))

function normalizePath(path) {
  return path.replace(/\\\\/g, "\\").replace(/\\/g, "/")
}

const projectRootNormalized = normalizePath(projectRoot)

for (const filepath of process.argv.slice(2)) {
  let content = readFileSync(filepath, "utf-8")
  content = content.replace(/"((?:\/|[A-Za-z]:[\\/])[^"]*)"/g, (_, rawPath) => {
    const normalized = normalizePath(rawPath)
    if (!normalized.startsWith(projectRootNormalized)) return `"${rawPath}"`
    const rel = relative(pkgDir, normalized).replaceAll(sep, "/")
    return `"${rel}"`
  })
  writeFileSync(filepath, content)
}
