import * as L from "../lisp/index.ts"

export function dependencyGraphCheck(dependencyGraph: L.DependencyGraph): void {
  for (const mod of L.dependencyGraphMods(dependencyGraph)) {
    for (const definition of L.modOwnDefinitions(mod)) {
      L.definitionCheck(definition)
    }
  }
}
