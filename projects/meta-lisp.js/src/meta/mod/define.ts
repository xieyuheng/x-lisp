import * as M from "../index.ts"

export function definePrimitiveFunction(
  mod: M.Mod,
  name: string,
  arity: number,
  fn: M.TypeFunction,
): void {
  M.modDefine(mod, name, M.PrimitiveFunctionDefinition(mod, name, arity, fn))
}

export function definePrimitiveVariable(
  mod: M.Mod,
  name: string,
  value: M.Type,
): void {
  M.modDefine(mod, name, M.PrimitiveVariableDefinition(mod, name, value))
}
