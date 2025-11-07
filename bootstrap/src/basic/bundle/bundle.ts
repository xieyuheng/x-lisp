import assert from "node:assert"
import { mapMapValue } from "../../helpers/map/mapMapValue.ts"
import { stringToSubscript } from "../../helpers/string/stringToSubscript.ts"
import { Block } from "../block/index.js"
import { importBuiltin } from "../builtin/index.ts"
import * as Definitions from "../definition/index.ts"
import type { Instr } from "../instr/index.ts"
import * as Instrs from "../instr/index.ts"
import { createMod, modPublicDefinitions, type Mod } from "../mod/index.ts"
import type { Value } from "../value/index.ts"

type Context = {
  entryMod: Mod
  dependencies: Map<string, Mod>
}

export function bundle(entryMod: Mod): Mod {
  const dependencies = entryMod.dependencies
  const context = { entryMod, dependencies }

  const bundleMod = createMod(new URL(`boundle:${entryMod.url}`))
  bundleMod.exported = entryMod.exported

  addEntryMod(context, bundleMod, entryMod)
  addBuiltinMod(context, bundleMod)

  for (const dependencyMod of dependencies.values()) {
    addDependencyMod(context, bundleMod, dependencyMod)
  }

  return bundleMod
}

export function addBuiltinMod(context: Context, bundleMod: Mod): void {
  // name in the builtin mod should be kept.
  importBuiltin(bundleMod)
}

export function addEntryMod(
  context: Context,
  bundleMod: Mod,
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
        mapMapValue(definition.blocks, (block) => qualifyBlock(context, block)),
        definition.meta,
      ),
    )
  }
}

export function addDependencyMod(
  context: Context,
  bundleMod: Mod,
  dependencyMod: Mod,
): void {
  // name in a dependency mod will be prefixed.
  const index = dependencyIndex(context.dependencies, dependencyMod)
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
        mapMapValue(definition.blocks, (block) => qualifyBlock(context, block)),
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

function qualifyBlock(context: Context, block: Block): Block {
  return Block(
    block.label,
    block.instrs.map((instr) => qualifyInstr(context, instr)),
    block.meta,
  )
}

function qualifyInstr(context: Context, instr: Instr): Instr {
  switch (instr.op) {
    case "Const": {
      return Instrs.Const(
        qualifyValue(context, instr.value),
        instr.dest, instr.meta,
      )
    }

    case "Call": {
      //
    }

    default: {
      return instr
    }
  }
}

function qualifyValue(context: Context, value: Value): Value {
  switch (value.kind) {

    default: {
      return value
    }
  }
}
