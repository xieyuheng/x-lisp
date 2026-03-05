import * as L from "../index.ts"

export function definePrimitiveFunction(
  mod: L.Mod,
  name: string,
  arity: number,
  fn: L.ValueFunction,
): void {
  L.modDefine(mod, name, L.PrimitiveFunctionDefinition(mod, name, arity, fn))
}

export function definePrimitiveVariable(
  mod: L.Mod,
  name: string,
  value: L.Value,
): void {
  L.modDefine(mod, name, L.PrimitiveVariableDefinition(mod, name, value))
}
