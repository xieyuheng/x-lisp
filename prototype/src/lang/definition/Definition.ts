import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Value } from "../value/index.ts"

// We have different kinds of definition,
// on lookup, they produce value in different ways.

export type Definition = ValueDefinition | LazyDefinition

export type ValueDefinition = {
  kind: "ValueDefinition"
  mod: Mod
  name: string
  value: Value
  schema?: Value
  validatedValue?: Value
}

export function ValueDefinition(
  mod: Mod,
  name: string,
  value: Value,
): ValueDefinition {
  return {
    kind: "ValueDefinition",
    mod,
    name,
    value,
  }
}

export type LazyDefinition = {
  kind: "LazyDefinition"
  mod: Mod
  name: string
  exp: Exp
  value?: Value
  schema?: Value
  validatedValue?: Value
}

export function LazyDefinition(
  mod: Mod,
  name: string,
  exp: Exp,
): LazyDefinition {
  return {
    kind: "LazyDefinition",
    mod,
    name,
    exp,
  }
}
