import { type DataConstructor } from "../value/Data.ts"

export type Pattern = VarPattern | ApplyPattern | DataConstructorPattern

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

export type ApplyPattern = {
  kind: "ApplyPattern"
  target: Pattern
  args: Array<Pattern>
}

export function ApplyPattern(
  target: Pattern,
  args: Array<Pattern>,
): ApplyPattern {
  return {
    kind: "ApplyPattern",
    target,
    args,
  }
}

export type DataConstructorPattern = {
  kind: "DataConstructorPattern"
  constructor: DataConstructor
}

export function DataConstructorPattern(
  constructor: DataConstructor,
): DataConstructorPattern {
  return {
    kind: "DataConstructorPattern",
    constructor,
  }
}
