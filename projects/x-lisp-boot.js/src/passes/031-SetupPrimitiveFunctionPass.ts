import * as B from "@xieyuheng/basic-lisp.js"
import { setUnionMany } from "@xieyuheng/helpers.js/set"

export function SetupPrimitiveFunction(basicMod: B.Mod): void {
  const primitiveFunctionNames = usedFunctionNames(basicMod)

  for (const definition of Array.from(basicMod.definitions.values())) {
    if (
      definition.kind === "PrimitiveFunctionDefinition" &&
      primitiveFunctionNames.has(definition.name)
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

function usedFunctionNames(basicMod: B.Mod): Set<string> {
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
      if (instr.value.kind === "Function") {
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
    // (define-variable <name>©constant)
    B.VariableDefinition(
      basicMod,
      `${definition.name}©constant`,
      B.Undefined(),
    ),

    // (define-setup <name>©setup
    //   (block body
    //     (= function-address (literal (@address <name>)))
    //     (= arity (literal <arity>))
    //     (= size (literal 0))
    //     (= curry (call (@primitive-function make-curry 3)
    //                function-address arity size))
    //     (store <name>©constant curry)
    //     (return)))
    B.SetupDefinition(
      basicMod,
      `${definition.name}©setup`,
      new Map([
        [
          "body",
          B.Block("body", [
            B.Literal(
              "function-address",
              B.Address(definition.name, { isPrimitive: true }),
            ),
            B.Literal("arity", B.Int(definition.arity)),
            B.Literal("size", B.Int(0)),
            B.Call(
              "curry",
              B.Function("make-curry", 3, { isPrimitive: true }),
              ["function-address", "arity", "size"],
            ),
            B.Store(`${definition.name}©constant`, "curry"),
            B.Return(),
          ]),
        ],
      ]),
    ),
  ]
}
