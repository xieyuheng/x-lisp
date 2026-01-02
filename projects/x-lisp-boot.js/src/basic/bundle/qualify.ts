import { mapMapValue } from "@xieyuheng/helpers.js/map"
import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as B from "../index.ts"
import type { BundleContext } from "./bundle.ts"
import { dependencyPrefix } from "./dependencyHelpers.ts"

export function qualifyDefinition(
  bundleMod: B.Mod,
  context: BundleContext,
  qualifiedName: string,
  definition: B.Definition,
): B.Definition {
  switch (definition.kind) {
    case "FunctionDefinition": {
      return B.FunctionDefinition(
        bundleMod,
        qualifiedName,
        mapMapValue(definition.blocks, (block) => qualifyBlock(context, block)),
        definition.meta,
      )
    }

    case "SetupDefinition": {
      return B.SetupDefinition(
        bundleMod,
        qualifiedName,
        mapMapValue(definition.blocks, (block) => qualifyBlock(context, block)),
        definition.meta,
      )
    }

    case "VariableDefinition": {
      return B.VariableDefinition(
        bundleMod,
        qualifiedName,
        qualifyValue(context, definition.value),
        definition.meta,
      )
    }

    case "MetadataDefinition": {
      return B.MetadataDefinition(
        bundleMod,
        qualifiedName,
        recordMapValue(definition.attributes, (metadata) =>
          qualifyMetadata(context, metadata),
        ),
        definition.meta,
      )
    }

    case "PlaceholderDefinition": {
      return B.PlaceholderDefinition(bundleMod, qualifiedName, definition.meta)
    }

    case "PrimitiveFunctionDefinition": {
      let message = `[qualifyDefinition] unhandled definition kind`
      message += `\n  kind: ${definition.kind}`
      throw new Error(message)
    }
  }
}

function qualifyMetadata(
  context: BundleContext,
  metadata: B.Metadata,
): B.Metadata {
  switch (metadata.kind) {
    case "IntMetadata": {
      return metadata
    }

    case "FloatMetadata": {
      return metadata
    }

    case "StringMetadata": {
      return metadata
    }

    case "PointerMetadata": {
      return B.PointerMetadata(qualifyName(context, metadata.name))
    }

    case "ListMetadata": {
      return B.ListMetadata(
        metadata.elements.map((element) => qualifyMetadata(context, element)),
      )
    }

    case "RecordMetadata": {
      return B.RecordMetadata(
        recordMapValue(metadata.attributes, (v) => qualifyMetadata(context, v)),
      )
    }
  }
}

function qualifyBlock(context: BundleContext, block: B.Block): B.Block {
  return B.Block(
    block.label,
    block.instrs.map((instr) => qualifyInstr(context, instr)),
    block.meta,
  )
}

function qualifyInstr(context: BundleContext, instr: B.Instr): B.Instr {
  switch (instr.op) {
    case "Literal": {
      return B.Literal(
        instr.dest,
        qualifyValue(context, instr.value),
        instr.meta,
      )
    }

    case "Call": {
      return B.Call(
        instr.dest,
        qualifyFunction(context, instr.fn),
        instr.args,
        instr.meta,
      )
    }

    case "Load": {
      return B.Load(instr.dest, qualifyName(context, instr.name), instr.meta)
    }

    case "Store": {
      return B.Store(qualifyName(context, instr.name), instr.source, instr.meta)
    }

    default: {
      return instr
    }
  }
}

function qualifyFunction(
  context: BundleContext,
  fn: B.FunctionRef,
): B.FunctionRef {
  if (fn.attributes.isPrimitive) {
    return fn
  } else {
    return B.FunctionRef(qualifyName(context, fn.name), fn.arity, {
      isPrimitive: false,
    })
  }
}

function qualifyAddress(context: BundleContext, address: B.Address): B.Address {
  if (address.attributes.isPrimitive) {
    return address
  } else {
    return B.Address(qualifyName(context, address.name), {
      isPrimitive: false,
    })
  }
}

function qualifyValue(context: BundleContext, value: B.Value): B.Value {
  switch (value.kind) {
    case "FunctionRef": {
      return qualifyFunction(context, value)
    }

    case "Address": {
      return qualifyAddress(context, value)
    }

    default: {
      return value
    }
  }
}

function qualifyName(context: BundleContext, name: string): string {
  const definition = B.modLookupDefinition(context.mod, name)
  if (definition === undefined) {
    let message = `[qualifyName] undefined name`
    message += `\n  current mod: ${context.mod.url}`
    message += `\n  name: ${name}`
    throw new Error(message)
  }

  if (definition.mod === context.entryMod) {
    return name
  } else if (definition.mod === B.useBuiltinMod()) {
    return name
  } else {
    const prefix = dependencyPrefix(context.dependencies, definition.mod)
    return `${prefix}/${name}`
  }
}
