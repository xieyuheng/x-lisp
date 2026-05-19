import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function definePrimitiveFunction(
  mod: M.Mod,
  name: string,
  arity: number,
  fn: M.TypeFunction,
  location: SourceLocation,
): void {
  M.modDefine(
    mod,
    name,
    M.PrimitiveFunctionDefinition(mod, name, arity, fn, location),
  )
}

export function definePrimitiveVariable(
  mod: M.Mod,
  name: string,
  value: M.Value,
  location: SourceLocation,
): void {
  M.modDefine(
    mod,
    name,
    M.PrimitiveVariableDefinition(mod, name, value, location),
  )
}
