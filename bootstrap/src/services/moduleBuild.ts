import { createUrl } from "../helpers/url/createUrl.ts"
import * as L from "../lang/index.ts"
import { projectBuild, projectFromSourceFiles } from "../project/index.ts"

export function moduleBuild(file: string) {
  const langMod = L.loadEntry(createUrl(file))
  const dependencyMods = Array.from(langMod.dependencies.values())
  const sourceFiles = dependencyMods.map((mod) => mod.url.pathname)
  const entryFile = langMod.url.pathname
  const project = projectFromSourceFiles(entryFile, sourceFiles)
  projectBuild(project)
}
