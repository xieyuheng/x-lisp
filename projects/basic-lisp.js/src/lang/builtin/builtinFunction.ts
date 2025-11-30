import assert from "node:assert"
import { definePrimitiveFunctionWithContext, provide } from "../define/index.ts"
import * as B from "../index.ts"
import { modLookupDefinition, type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinFunction(mod: Mod) {
  provide(mod, ["make-function"])

  definePrimitiveFunctionWithContext(
    mod,
    "make-function",
    2,
    (context) => (functionAddress, metadataAddress) => {
      const definition = modLookupDefinition(
        context.mod,
        Values.asAddress(metadataAddress).name,
      )
      assert(definition)
      assert(definition.kind === "MetadataDefinition")
      const arity = Number(
        B.asIntMetadata(definition.attributes["arity"]).content,
      )
      const isPrimitive =
        B.asIntMetadata(definition.attributes["is-primitive"]).content === 1n
      return Values.Function(Values.asAddress(functionAddress).name, arity, {
        isPrimitive,
      })
    },
  )
}
