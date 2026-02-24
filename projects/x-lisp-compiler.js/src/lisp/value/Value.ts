import type { Definition } from "../definition/index.ts"
import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
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
  | DefinitionValue

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

export type DefinitionValue = {
  kind: "DefinitionValue"
  definition: Definition
}

export function DefinitionValue(definition: Definition): DefinitionValue {
  return {
    kind: "DefinitionValue",
    definition,
  }
}
