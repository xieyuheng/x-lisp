import { createUrl } from "@xieyuheng/helpers.js/url"
import * as L from "../lang/index.ts"
import { projectFromSourceFiles, type Project } from "./index.ts"

export function loadModuleProject(file: string): Project {
  const langMod = L.loadEntry(createUrl(file))
  const dependencyMods = Array.from(langMod.dependencies.values())
  const sourceFiles = dependencyMods.map((mod) => mod.url.pathname)
  const entryFile = langMod.url.pathname
  return projectFromSourceFiles(entryFile, sourceFiles)
}
