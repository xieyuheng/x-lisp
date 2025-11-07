import assert from "node:assert"
import { mapMapValue } from "../../helpers/map/mapMapValue.ts"
import { stringToSubscript } from "../../helpers/string/stringToSubscript.ts"
import { Block } from "../block/index.js"
import { importBuiltin, useBuiltinMod } from "../builtin/index.ts"
import * as Definitions from "../definition/index.ts"
import type { Instr } from "../instr/index.ts"
import * as Instrs from "../instr/index.ts"
import {
  createMod,
  modLookupDefinition,
  modOwnDefinitions,
  type Mod,
} from "../mod/index.ts"
import { prettyMod } from "../pretty/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"

type Context = {
  entryMod: Mod
  dependencies: Map<string, Mod>
  mod: Mod
}

export function bundle(entryMod: Mod): Mod {
  const dependencies = entryMod.dependencies
  const bundleMod = createMod(new URL(`boundle:${entryMod.url}`))
  bundleMod.exported = entryMod.exported

  addEntryMod(bundleMod, { entryMod, dependencies, mod: entryMod })

  addBuiltinMod(bundleMod)

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

export function addEntryMod(bundleMod: Mod, context: Context): void {
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

export function addDependencyMod(bundleMod: Mod, context: Context): void {
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

function dependencyPrefix(dependencies: Map<string, Mod>, mod: Mod): string {
  const index = dependencyIndex(dependencies, mod)
  const count = index + 1
  const subscript = stringToSubscript(count.toString())
  const prefix = `§${subscript}`
  return prefix
}

function dependencyIndex(dependencies: Map<string, Mod>, mod: Mod): number {
  const keys = Array.from(dependencies.keys())
  const index = keys.indexOf(mod.url.href)
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
        instr.dest,
        instr.meta,
      )
    }

    case "Call": {
      return Instrs.Call(
        qualifyName(context, instr.name),
        instr.operands,
        instr.dest,
        instr.meta,
      )
    }

    default: {
      return instr
    }
  }
}

function qualifyValue(context: Context, value: Value): Value {
  switch (value.kind) {
    case "FunctionRef": {
      return Values.FunctionRef(qualifyName(context, value.name), value.arity)
    }

    default: {
      return value
    }
  }
}

function qualifyName(context: Context, name: string): string {
  if (context.mod === context.entryMod) {
    return name
  } else if (context.mod === useBuiltinMod()) {
    return name
  } else {
    const definition = modLookupDefinition(context.mod, name)
    assert(definition)
    const prefix = dependencyPrefix(context.dependencies, definition.mod)
    return `${prefix}/${name}`
  }
}
