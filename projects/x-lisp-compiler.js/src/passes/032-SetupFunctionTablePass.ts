import assert from "node:assert"
import * as B from "../basic/index.ts"
import { getUsedFunctionNames } from "./031-SetupPrimitiveFunctionPass.ts"

export function SetupFunctionTablePass(basicMod: B.Mod): void {
  basicMod.exported.add("_function_table")

  const functionNames = Array.from(getUsedFunctionNames(basicMod)).filter(
    (name) => {
      if (name.includes("©")) return false
      const definition = basicMod.definitions.get(name)
      assert(definition)
      return definition.kind === "FunctionDefinition"
    },
  )

  basicMod.definitions.set(
    "_function_table",
    B.MetadataDefinition(basicMod, "_function_table", {
      length: B.IntMetadata(BigInt(functionNames.length)),
      entries: B.ListMetadata(
        functionNames.map((name) => B.PointerMetadata(`${name}©metadata`)),
      ),
    }),
  )
}
