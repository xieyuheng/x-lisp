import { type DataConstructor } from "../value/Data.ts"

export type Pattern = PatternVar | DataPattern

export type PatternVar = {
  kind: "PatternVar"
  name: string
}

export function PatternVar(name: string): PatternVar {
  return {
    kind: "PatternVar",
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
