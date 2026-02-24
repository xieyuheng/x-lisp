import * as L from "../index.ts"

export type DependencyGraph = {
  dependencies: Map<string, L.Mod>
}

export function createDependencyGraph() : DependencyGraph{
  return {
    dependencies: new Map()
  }
}
