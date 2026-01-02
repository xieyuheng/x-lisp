import assert from "node:assert";
import * as L from "../lisp/index.ts"
import { createBuiltinMod } from "./createBuiltinMod.ts";
import { useBuiltinMod } from "./useBuiltinMod.ts";

export function importBuiltinMod(mod: L.Mod): void {
  const builtinMod = useBuiltinMod()
  for (const definition of builtinMod.definitions.values()) {
    mod.definitions.set(definition.name, definition)
  }
}
