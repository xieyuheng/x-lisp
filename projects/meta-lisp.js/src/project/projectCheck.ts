import {
  callWithFile,
  openOutputFile,
  withOutputToFile,
} from "@xieyuheng/helpers.js/file"
import * as M from "../meta/index.ts"
import {
  projectGetSourcePath,
  projectSourceIds,
  type Project,
} from "./index.ts"

export function projectCheck(
  project: Project,
  dependencyGraph: M.DependencyGraph,
): void {
  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    M.loadMod(path, dependencyGraph)
  }

  M.dependencyGraphForEachDefinition(dependencyGraph, M.definitionDesugar)

  M.dependencyGraphForEachMod(dependencyGraph, (mod) => {
    if (mod.path.endsWith(".type-error.meta")) {
      callWithFile(openOutputFile(`${mod.path}.out`), (file) => {
        withOutputToFile(file, () => {
          M.modForEachOwnDefinition(mod, M.definitionCheck)
        })
      })
    } else {
      M.modForEachOwnDefinition(mod, M.definitionCheck)
    }
  })
}
