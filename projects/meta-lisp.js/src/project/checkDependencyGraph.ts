import * as L from "../lisp/index.ts"

export function checkDependencyGraph(dependencyGraph: L.DependencyGraph): void {
  for (const mod of L.dependencyGraphMods(dependencyGraph)) {
    for (const definition of L.modOwnDefinitions(mod)) {
      L.definitionCheck(definition)
    }
  }
}
