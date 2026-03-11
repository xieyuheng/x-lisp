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
}
