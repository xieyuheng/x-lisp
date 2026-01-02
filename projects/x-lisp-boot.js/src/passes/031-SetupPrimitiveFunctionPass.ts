import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as B from "../basic/index.ts"

export function SetupPrimitiveFunction(basicMod: B.Mod): void {
  const usedFunctionNames = getUsedFunctionNames(basicMod)

  for (const definition of Array.from(basicMod.definitions.values())) {
    if (
      definition.kind === "PrimitiveFunctionDefinition" &&
      usedFunctionNames.has(definition.name)
    ) {
      for (const basicDefinition of onPrimitiveFunctionDefinition(
        basicMod,
        definition,
      )) {
        basicMod.definitions.set(basicDefinition.name, basicDefinition)
      }
    }
  }
}

export function getUsedFunctionNames(basicMod: B.Mod): Set<string> {
  return setUnionMany(
    Array.from(basicMod.definitions.values()).map((definition) => {
      if (
        definition.kind === "FunctionDefinition" ||
        definition.kind === "SetupDefinition"
      ) {
        return setUnionMany(
          Array.from(definition.blocks.values()).map(usedInBlock),
        )
      } else {
        return new Set()
      }
    }),
  )
}

function usedInBlock(block: B.Block): Set<string> {
  return setUnionMany(block.instrs.map(usedInInstr))
}

function usedInInstr(instr: B.Instr): Set<string> {
  switch (instr.op) {
    case "Call": {
      return new Set([instr.fn.name])
    }

    case "Literal": {
      if (instr.value.kind === "FunctionRef") {
        return new Set([instr.value.name])
      } else {
        return new Set()
      }
    }

    default: {
      return new Set()
    }
  }
}

function onPrimitiveFunctionDefinition(
  basicMod: B.Mod,
  definition: B.PrimitiveFunctionDefinition,
): Array<B.Definition> {
  return [
    // (define-metadata <name>©metadata
    //   :name "<name>"
    //   :arity <arity>
    //   :is-primitive 1
    //   :variable-info 0
    //   :start 0
    //   :end 0)
    B.MetadataDefinition(basicMod, `${definition.name}©metadata`, {
      name: B.StringMetadata(definition.name),
      arity: B.IntMetadata(BigInt(definition.arity)),
      "is-primitive": B.IntMetadata(1n),
      "variable-info": B.IntMetadata(0n), // NULL
      start: B.IntMetadata(0n), // NULL
      end: B.IntMetadata(0n), // NULL
    }),

    // (define-variable <name>©constant)
    B.VariableDefinition(
      basicMod,
      `${definition.name}©constant`,
      B.Undefined(),
    ),

    // (define-setup <name>©setup
    //   (block body
    //     (= address (literal (@address <name>)))
    //     (= metadata (literal (@address <name>©metadata)))
    //     (= function (call (@primitive-function make-function 2) address metadata))
    //     (store <name>©constant function)
    //     (return)))
    B.SetupDefinition(
      basicMod,
      `${definition.name}©setup`,
      new Map([
        [
          "body",
          B.Block("body", [
            B.Literal(
              "address",
              B.Address(definition.name, { isPrimitive: true }),
            ),
            B.Literal(
              "metadata",
              B.Address(`${definition.name}©metadata`, { isPrimitive: false }),
            ),
            B.Call(
              "function",
              B.FunctionRef("make-function", 2, { isPrimitive: true }),
              ["address", "metadata"],
            ),
            B.Store(`${definition.name}©constant`, "function"),
            B.Return(),
          ]),
        ],
      ]),
    ),
  ]
}
