import { createUrl } from "../helpers/url/createUrl.ts"
import * as L from "../lang/index.ts"
import {
  projectBuild,
  projectFromSourceFiles,
  projectTest,
  type Project,
} from "./index.ts"

export function loadModuleProject(file: string): Project {
  const langMod = L.loadEntry(createUrl(file))
  const dependencyMods = Array.from(langMod.dependencies.values())
  const sourceFiles = dependencyMods.map((mod) => mod.url.pathname)
  const entryFile = langMod.url.pathname
  return projectFromSourceFiles(entryFile, sourceFiles)
}

export function moduleProjectBuild(file: string): void {
  const project = loadModuleProject(file)
  projectBuild(project)
}

export function moduleProjectTest(file: string): void {
  const project = loadModuleProject(file)
  projectBuild(project)
  projectTest(project)
}
