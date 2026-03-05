import * as L from "../index.ts"

export type DependencyGraph = {
  dependencies: Map<string, L.Mod>
}

export function createDependencyGraph(): DependencyGraph {
  return {
    dependencies: new Map(),
  }
}

export function dependencyGraphLookupMod(
  dependencyGraph: DependencyGraph,
  url: URL,
): L.Mod | undefined {
  return dependencyGraph.dependencies.get(url.href)
}

export function dependencyGraphAddMod(
  dependencyGraph: DependencyGraph,
  mod: L.Mod,
): void {
  dependencyGraph.dependencies.set(mod.url.href, mod)
}

export function dependencyGraphAllMods(
  dependencyGraph: DependencyGraph,
): Array<L.Mod> {
  return Array.from(dependencyGraph.dependencies.values())
}
