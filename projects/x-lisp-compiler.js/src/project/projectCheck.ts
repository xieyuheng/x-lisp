import { createUrl } from "@xieyuheng/helpers.js/url"
import * as L from "../lisp/index.ts"
import {
  projectForEachSource,
  projectGetSourceFile,
  type Project,
} from "./index.ts"

export function projectCheck(project: Project): void {
  const dependencyGraph = L.createDependencyGraph()

  projectForEachSource(project, (project, id) => {
    const inputFile = projectGetSourceFile(project, id)
    L.load(createUrl(inputFile), dependencyGraph)
  })
}
