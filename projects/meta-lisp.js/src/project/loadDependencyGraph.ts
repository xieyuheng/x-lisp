import { createUrl } from "@xieyuheng/helpers.js/url"
import * as L from "../lisp/index.ts"

export function loadDependencyGraph(file: string): L.DependencyGraph {
  const dependencyGraph = L.createDependencyGraph()
  L.load(createUrl(file), dependencyGraph)
  return dependencyGraph
}
