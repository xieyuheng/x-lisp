import { createUrl } from "@xieyuheng/helpers.js/url"
import * as L from "../lisp/index.ts"
import { projectFromSourceFiles, type Project } from "./index.ts"

export function loadModuleProject(file: string): Project {
  const mod = L.load(createUrl(file), new Map())
  const dependencyMods = Array.from(mod.dependencies.values())
  const sourceFiles = dependencyMods.map((mod) => mod.url.pathname)
  const entryFile = mod.url.pathname
  return projectFromSourceFiles(entryFile, sourceFiles)
}
