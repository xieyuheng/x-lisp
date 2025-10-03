import { type Exp } from "../exp/index.ts"
import { type Value } from "../value/index.ts"
import { type Mod } from "./Mod.ts"

// We have different kinds of definition,
// on lookup, they produce value in different ways.

export type Definition = ValueDefinition | LazyDefinition

export type ValueDefinition = {
  kind: "ValueDefinition"
  origin: Mod
  name: string
  value: Value
}

export function ValueDefinition(
  origin: Mod,
  name: string,
  value: Value,
): ValueDefinition {
  return {
    kind: "ValueDefinition",
    origin,
    name,
    value,
  }
}

export type LazyDefinition = {
  kind: "LazyDefinition"
  origin: Mod
  name: string
  exp: Exp
  value?: Value
}

export function LazyDefinition(
  origin: Mod,
  name: string,
  exp: Exp,
): LazyDefinition {
  return {
    kind: "LazyDefinition",
    origin,
    name,
    exp,
  }
}
