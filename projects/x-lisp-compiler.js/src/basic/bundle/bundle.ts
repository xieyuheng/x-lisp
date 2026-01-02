import { importBuiltin } from "../builtin/index.ts"
import { createMod, modOwnDefinitions, type Mod } from "../mod/index.ts"
import { dependencyPrefix } from "./dependencyHelpers.ts"
import { qualifyDefinition } from "./qualify.ts"

export type BundleContext = {
  entryMod: Mod
  dependencies: Map<string, Mod>
  mod: Mod
}

export function bundle(entryMod: Mod): Mod {
  const dependencies = entryMod.dependencies
  const bundleMod = createMod(new URL(`boundle:${entryMod.url}`), new Map())

  importBuiltin(bundleMod)
  mergeEntryMod(bundleMod, { entryMod, dependencies, mod: entryMod })
  for (const mod of dependencies.values()) {
    if (mod !== entryMod) {
      mergeDependencyMod(bundleMod, { entryMod, dependencies, mod })
    }
  }

  return bundleMod
}

function mergeEntryMod(bundleMod: Mod, context: BundleContext): void {
  const { entryMod } = context
  // name in the entry mod should be kept.
  for (const definition of modOwnDefinitions(entryMod)) {
    const qualifiedName = definition.name
    bundleMod.definitions.set(
      qualifiedName,
      qualifyDefinition(bundleMod, context, qualifiedName, definition),
    )
  }
}

function mergeDependencyMod(bundleMod: Mod, context: BundleContext): void {
  // name in a dependency mod will be prefixed.
  const prefix = dependencyPrefix(context.dependencies, context.mod)
  for (const definition of modOwnDefinitions(context.mod)) {
    const qualifiedName = `${prefix}/${definition.name}`
    bundleMod.definitions.set(
      qualifiedName,
      qualifyDefinition(bundleMod, context, qualifiedName, definition),
    )
  }
}
