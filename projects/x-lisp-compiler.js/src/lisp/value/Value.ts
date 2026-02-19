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

export type Attributes = Record<string, Value>

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
  kind: "Tael"
  elements: Array<Value>
  attributes: Attributes
}

export function TaelValue(
  elements: Array<Value>,
  attributes: Attributes,
): TaelValue {
  return {
    kind: "Tael",
    elements,
    attributes,
  }
}

export type ClosureValue = {
  kind: "Closure"
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
    kind: "Closure",
    mod,
    env,
    parameters,
    body,
  }
}

export type FunctionValue = {
  kind: "Function"
  definition: FunctionDefinition
}

export function FunctionValue(
  definition: FunctionDefinition,
): FunctionValue {
  return {
    kind: "Function",
    definition,
  }
}

export type PrimitiveFunctionValue = {
  kind: "PrimitiveFunction"
  definition: PrimitiveFunctionDefinition
}

export function PrimitiveFunctionValue(
  definition: PrimitiveFunctionDefinition,
): PrimitiveFunctionValue {
  return {
    kind: "PrimitiveFunction",
    definition,
  }
}

export type CurryValue = {
  kind: "Curry"
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
    kind: "Curry",
    target,
    arity,
    args,
  }
}

export type DatatypeConstructorValue = {
  kind: "DatatypeConstructor"
  definition: DatatypeDefinition
}

export function DatatypeConstructorValue(
  definition: DatatypeDefinition,
): DatatypeConstructorValue {
  return {
    kind: "DatatypeConstructor",
    definition,
  }
}
