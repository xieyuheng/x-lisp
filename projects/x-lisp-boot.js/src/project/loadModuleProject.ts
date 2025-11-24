import { createUrl } from "@xieyuheng/helpers.js/url"
import * as X from "../index.ts"
import { projectFromSourceFiles, type Project } from "./index.ts"

export function loadModuleProject(file: string): Project {
  const xMod = X.loadEntry(createUrl(file))
  const dependencyMods = Array.from(xMod.dependencies.values())
  const sourceFiles = dependencyMods.map((mod) => mod.url.pathname)
  const entryFile = xMod.url.pathname
  return projectFromSourceFiles(entryFile, sourceFiles)
}
