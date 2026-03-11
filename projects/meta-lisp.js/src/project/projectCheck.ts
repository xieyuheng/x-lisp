import { createUrl } from "@xieyuheng/helpers.js/url"
import * as L from "../lisp/index.ts"
import {
  projectGetSourceFile,
  projectSourceIds,
  type Project,
} from "./index.ts"

export function projectCheck(project: Project): void {
  const dependencyGraph = L.createDependencyGraph()

  for (const id of projectSourceIds(project)) {
    const inputFile = projectGetSourceFile(project, id)
    L.loadMod(createUrl(inputFile), dependencyGraph)
  }

  checkDependencyGraph(dependencyGraph)
}

export function checkDependencyGraph(dependencyGraph: L.DependencyGraph): void {
  for (const mod of L.dependencyGraphMods(dependencyGraph)) {
    for (const definition of L.modOwnDefinitions(mod)) {
      L.definitionCheck(definition)
    }
  }
}
