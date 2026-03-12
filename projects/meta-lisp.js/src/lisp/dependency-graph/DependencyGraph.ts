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
  path: string,
): L.Mod | undefined {
  return dependencyGraph.dependencies.get(path)
}

export function dependencyGraphAddMod(
  dependencyGraph: DependencyGraph,
  mod: L.Mod,
): void {
  dependencyGraph.dependencies.set(mod.path, mod)
}

export function dependencyGraphMods(
  dependencyGraph: DependencyGraph,
): Array<L.Mod> {
  return Array.from(dependencyGraph.dependencies.values())
}

export function dependencyGraphFiles(
  dependencyGraph: DependencyGraph,
): Array<string> {
  const mods = dependencyGraphMods(dependencyGraph)
  return mods.map((mod) => mod.path)
}

export function dependencyGraphForEachDefinition(
  dependencyGraph: DependencyGraph,
  callback: (definition: L.Definition) => void,
): void {
  for (const mod of dependencyGraphMods(dependencyGraph)) {
    L.modForEachOwnDefinition(mod, callback)
  }
}
