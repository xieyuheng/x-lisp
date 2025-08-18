import { type DataConstructor } from "../value/Data.ts"

export type Pattern = VarPattern | DataPattern | TaelPattern

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
