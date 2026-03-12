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
  L.dependencyGraphForEachDefinition(dependencyGraph, L.definitionCheck)
}
