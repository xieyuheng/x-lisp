import Path from "node:path"
import { createUrl } from "../helpers/url/createUrl.ts"
import * as L from "../lang/index.ts"
import { createProject } from "../project/index.ts"

export function buildModule(file: string) {
  const langMod = L.loadEntry(createUrl(file))
  const dependencyMods = Array.from(langMod.dependencies.values())
  const sourceFiles = dependencyMods.map((mod) => mod.url.pathname)

  const entryFile = langMod.url.pathname
  const rootDirectory = Path.dirname(entryFile)
  const project = createProject(rootDirectory, {
    name: "*",
    version: "*",
    build: {
      "source-directory": rootDirectory,
    },
  })
  project.sourceIds = sourceFiles.map((file) =>
    Path.relative(rootDirectory, file),
  )

  console.log(project)
}
