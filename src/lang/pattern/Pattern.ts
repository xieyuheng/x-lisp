import { type DataConstructor, type Value } from "../value/index.ts"

export type Pattern =
  | VarPattern
  | DataPattern
  | TaelPattern
  | LiteralPattern
  | ConsStarPattern

export type VarPattern = {
  kind: "VarPattern"
  name: string
}

export function VarPattern(name: string): VarPattern {
  return {
    kind: "VarPattern",
    name,
  }
}

export type DataPattern = {
  kind: "DataPattern"
  constructor: DataConstructor
  args: Array<Pattern>
}

export function DataPattern(
  constructor: DataConstructor,
  args: Array<Pattern>,
): DataPattern {
  return {
    kind: "DataPattern",
    constructor,
    args,
  }
}

export type TaelPattern = {
  kind: "TaelPattern"
  elements: Array<Pattern>
  attributes: Record<string, Pattern>
}

export function TaelPattern(
  elements: Array<Pattern>,
  attributes: Record<string, Pattern>,
): TaelPattern {
  return {
    kind: "TaelPattern",
    elements,
    attributes,
  }
}

export type LiteralPattern = {
  kind: "LiteralPattern"
  value: Value
}

export function LiteralPattern(value: Value): LiteralPattern {
  return {
    kind: "LiteralPattern",
    value,
  }
}

export type ConsStarPattern = {
  kind: "ConsStarPattern"
  elements: Array<Pattern>
  rest: Pattern
}

export function ConsStarPattern(
  elements: Array<Pattern>,

  rest: Pattern,
): ConsStarPattern {
  return {
    kind: "ConsStarPattern",
    elements,

    rest,
  }
}
