import * as M from "../index.ts"

export type DependencyGraph = {
  dependencies: Map<string, M.Mod>
}

export function createDependencyGraph(): DependencyGraph {
  return {
    dependencies: new Map(),
  }
}

export function dependencyGraphLookupMod(
  dependencyGraph: DependencyGraph,
  name: string,
): M.Mod | undefined {
  return dependencyGraph.dependencies.get(name)
}

export function dependencyGraphAddMod(
  dependencyGraph: DependencyGraph,
  mod: M.Mod,
): void {
  dependencyGraph.dependencies.set(mod.name, mod)
}

export function dependencyGraphMods(
  dependencyGraph: DependencyGraph,
): Array<M.Mod> {
  return Array.from(dependencyGraph.dependencies.values())
}

export function dependencyGraphModNames(
  dependencyGraph: DependencyGraph,
): Array<string> {
  const mods = dependencyGraphMods(dependencyGraph)
  return mods.map((mod) => mod.name)
}

export function dependencyGraphForEachMod(
  dependencyGraph: DependencyGraph,
  callback: (mod: M.Mod) => void,
): void {
  for (const mod of dependencyGraph.dependencies.values()) {
    callback(mod)
  }
}

export function dependencyGraphForEachDefinition(
  dependencyGraph: DependencyGraph,
  callback: (definition: M.Definition) => void,
): void {
  M.dependencyGraphForEachMod(dependencyGraph, (mod) => {
    M.modForEachOwnDefinition(mod, callback)
  })
}
