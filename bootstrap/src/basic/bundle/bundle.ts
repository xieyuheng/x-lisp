import assert from "node:assert"
import { importBuiltin } from "../builtin/index.ts"
import * as Definitions from "../definition/index.ts"
import { createMod, modPublicDefinitions, type Mod } from "../mod/index.ts"
import { stringToSubscript } from "../../helpers/string/stringToSubscript.ts"

export function bundle(entryMod: Mod): Mod {
  const dependencies = entryMod.dependencies
  const bundleMod = createMod(new URL(`boundle:${entryMod.url}`))
  bundleMod.exported = entryMod.exported

  addEntryMod(bundleMod, dependencies, entryMod)
  addBuiltinMod(bundleMod)
  for (const dependencyMod of dependencies.values()) {
    addDependencyMod(bundleMod, dependencies, dependencyMod)
  }

  return bundleMod
}

export function addBuiltinMod(bundleMod: Mod): void {
  // name in the builtin mod should be kept.
  importBuiltin(bundleMod)
}

export function addEntryMod(
  bundleMod: Mod,
  dependencies: Map<string, Mod>,
  entryMod: Mod,
): void {
  // name in the entry mod should be kept.
  for (const definition of modPublicDefinitions(entryMod).values()) {
    const name = definition.name
    assert(definition.kind === "FunctionDefinition")
    bundleMod.definitions.set(
      name,
      Definitions.FunctionDefinition(
        bundleMod,
        name,
        definition.blocks, // TODO
        definition.meta,
      ),
    )
  }
}

export function addDependencyMod(
  bundleMod: Mod,
  dependencies: Map<string, Mod>,
  dependencyMod: Mod,
): void {
  // name in a dependency mod will be prefixed.
  const index = dependencyIndex(dependencies, dependencyMod)
  const count = index + 1
  const subscript = stringToSubscript(count.toString())
  const prefix = `§${subscript}`
  for (const definition of modPublicDefinitions(dependencyMod).values()) {
    const name = `${prefix}/${definition.name}`
    assert(definition.kind === "FunctionDefinition")
    bundleMod.definitions.set(
      name,
      Definitions.FunctionDefinition(
        bundleMod,
        name,
        definition.blocks,
        // mapMapValue(definition.blocks, block => qualifyBlock(context, block)),
        definition.meta,
      ),
    )
  }
}

function dependencyIndex(
  dependencies: Map<string, Mod>,
  dependencyMod: Mod,
): number {
  const keys = Array.from(dependencies.keys())
  const index = keys.indexOf(dependencyMod.url.href)
  assert(index >= 0)
  return index
}
