import { createUrl } from "@xieyuheng/helpers.js/url"
import * as L from "../lisp/index.ts"
import { projectFromSourceFiles, type Project } from "./index.ts"

export function loadModuleProject(file: string): Project {
  const mod = L.load(createUrl(file), L.createDependencyGraph())
  const dependencyMods = L.dependencyGraphAllMods(mod.dependencyGraph)
  const sourceFiles = dependencyMods.map((mod) => mod.url.pathname)
  const entryFile = mod.url.pathname
  return projectFromSourceFiles(entryFile, sourceFiles)
}
