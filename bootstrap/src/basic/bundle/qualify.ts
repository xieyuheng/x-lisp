import { Block } from "../block/index.ts"
import { useBuiltinMod } from "../builtin/index.ts"
import type { Instr } from "../instr/index.ts"
import * as Instrs from "../instr/index.ts"
import { modLookupDefinition } from "../mod/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"
import type { BundleContext } from "./bundle.ts"
import { dependencyPrefix } from "./dependencyHelpers.ts"

export function qualifyBlock(context: BundleContext, block: Block): Block {
  return Block(
    block.label,
    block.instrs.map((instr) => qualifyInstr(context, instr)),
    block.meta,
  )
}

function qualifyInstr(context: BundleContext, instr: Instr): Instr {
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

function qualifyValue(context: BundleContext, value: Value): Value {
  switch (value.kind) {
    case "FunctionRef": {
      return Values.FunctionRef(qualifyName(context, value.name), value.arity)
    }

    default: {
      return value
    }
  }
}

function qualifyName(context: BundleContext, name: string): string {
  const definition = modLookupDefinition(context.mod, name)
  if (definition === undefined) {
    let message = `[bundle/qualifyName] undefined name`
    message += `\n  current mod: ${context.mod.url}`
    message += `\n  name: ${name}`
    throw new Error(message)
  }

  if (definition.mod === context.entryMod) {
    return name
  } else if (definition.mod === useBuiltinMod()) {
    return name
  } else {
    const prefix = dependencyPrefix(context.dependencies, definition.mod)
    return `${prefix}/${name}`
  }
}
