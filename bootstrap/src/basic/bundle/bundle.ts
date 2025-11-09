import assert from "node:assert"
import { mapMapValue } from "../../helpers/map/mapMapValue.ts"
import { importBuiltin } from "../builtin/index.ts"
import * as Definitions from "../definition/index.ts"
import { createMod, modOwnDefinitions, type Mod } from "../mod/index.ts"
import { dependencyPrefix } from "./dependencyHelpers.ts"
import { qualifyBlock } from "./qualify.ts"

export type BundleContext = {
  entryMod: Mod
  dependencies: Map<string, Mod>
  mod: Mod
}

export function bundle(entryMod: Mod): Mod {
  const dependencies = entryMod.dependencies
  const bundleMod = createMod(new URL(`boundle:${entryMod.url}`))
  bundleMod.exported = entryMod.exported

  addBuiltinMod(bundleMod)
  addEntryMod(bundleMod, { entryMod, dependencies, mod: entryMod })
  for (const dependencyMod of dependencies.values()) {
    addDependencyMod(bundleMod, {
      entryMod,
      dependencies,
      mod: dependencyMod,
    })
  }

  return bundleMod
}

export function addBuiltinMod(bundleMod: Mod): void {
  // name in the builtin mod should be kept.
  importBuiltin(bundleMod)
}

export function addEntryMod(bundleMod: Mod, context: BundleContext): void {
  const { entryMod } = context
  // name in the entry mod should be kept.
  for (const definition of modOwnDefinitions(entryMod)) {
    const name = definition.name
    assert(definition.kind === "FunctionDefinition")
    bundleMod.definitions.set(
      name,
      Definitions.FunctionDefinition(
        bundleMod,
        name,
        mapMapValue(definition.blocks, (block) => qualifyBlock(context, block)),
        definition.meta,
      ),
    )
  }
}

export function addDependencyMod(bundleMod: Mod, context: BundleContext): void {
  // name in a dependency mod will be prefixed.
  const prefix = dependencyPrefix(context.dependencies, context.mod)
  for (const definition of modOwnDefinitions(context.mod)) {
    const name = `${prefix}/${definition.name}`
    assert(definition.kind === "FunctionDefinition")
    bundleMod.definitions.set(
      name,
      Definitions.FunctionDefinition(
        bundleMod,
        name,
        mapMapValue(definition.blocks, (block) => qualifyBlock(context, block)),
        definition.meta,
      ),
    )
  }
}
