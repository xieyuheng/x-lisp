import {
  callWithFile,
  openOutputFile,
  withOutputToFile,
} from "@xieyuheng/helpers.js/file"
import * as L from "../lisp/index.ts"
import {
  projectGetSourcePath,
  projectSourceIds,
  type Project,
} from "./index.ts"

export function projectCheck(
  project: Project,
  dependencyGraph: L.DependencyGraph,
): void {
  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    L.loadMod(path, dependencyGraph)
  }

  L.dependencyGraphForEachDefinition(dependencyGraph, L.definitionDesugar)

  L.dependencyGraphForEachMod(dependencyGraph, (mod) => {
    if (mod.path.endsWith(".type-error.meta")) {
      callWithFile(openOutputFile(`${mod.path}.out`), (file) => {
        withOutputToFile(file, () => {
          L.modForEachOwnDefinition(mod, L.definitionCheck)
        })
      })
    } else {
      L.modForEachOwnDefinition(mod, L.definitionCheck)
    }
  })
}
