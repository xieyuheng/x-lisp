import type {
  DatatypeDefinition,
  FunctionDefinition,
  PrimitiveFunctionDefinition,
} from "../definition/index.ts"
import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
import type { AboutDatatype } from "./AboutDatatype.ts"
import { type AtomValue } from "./Atom.ts"
import { type HashValue } from "./Hash.ts"
import { type SetValue } from "./Set.ts"

export type Value =
  | AtomValue
  | TaelValue
  | SetValue
  | HashValue
  | ClosureValue
  | CurryValue
  | AboutDatatype
  | FunctionValue
  | PrimitiveFunctionValue
  | DatatypeConstructorValue

export type TaelValue = {
  kind: "TaelValue"
  elements: Array<Value>
  attributes: Record<string, Value>
}

export function TaelValue(
  elements: Array<Value>,
  attributes: Record<string, Value>,
): TaelValue {
  return {
    kind: "TaelValue",
    elements,
    attributes,
  }
}

export type ClosureValue = {
  kind: "ClosureValue"
  mod: Mod
  env: Env
  parameters: Array<string>
  body: Exp
}

export function ClosureValue(
  mod: Mod,
  env: Env,
  parameters: Array<string>,
  body: Exp,
): ClosureValue {
  return {
    kind: "ClosureValue",
    mod,
    env,
    parameters,
    body,
  }
}

export type FunctionValue = {
  kind: "FunctionValue"
  definition: FunctionDefinition
}

export function FunctionValue(definition: FunctionDefinition): FunctionValue {
  return {
    kind: "FunctionValue",
    definition,
  }
}

export type PrimitiveFunctionValue = {
  kind: "PrimitiveFunctionValue"
  definition: PrimitiveFunctionDefinition
}

export function PrimitiveFunctionValue(
  definition: PrimitiveFunctionDefinition,
): PrimitiveFunctionValue {
  return {
    kind: "PrimitiveFunctionValue",
    definition,
  }
}

export type CurryValue = {
  kind: "CurryValue"
  target: Value
  arity: number
  args: Array<Value>
}

export function CurryValue(
  target: Value,
  arity: number,
  args: Array<Value>,
): CurryValue {
  return {
    kind: "CurryValue",
    target,
    arity,
    args,
  }
}

export type DatatypeConstructorValue = {
  kind: "DatatypeConstructorValue"
  definition: DatatypeDefinition
}

export function DatatypeConstructorValue(
  definition: DatatypeDefinition,
): DatatypeConstructorValue {
  return {
    kind: "DatatypeConstructorValue",
    definition,
  }
}
