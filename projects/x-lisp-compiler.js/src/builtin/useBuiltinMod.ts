import assert from "node:assert";
import * as L from "../lisp/index.ts"
import { createBuiltinMod } from "./createBuiltinMod.ts";

let globalBuiltinMod: L.Mod | undefined = undefined;

export function useBuiltinMod(): L.Mod {
  if (!globalBuiltinMod) {
    globalBuiltinMod = createBuiltinMod();
  }

  return globalBuiltinMod
}
