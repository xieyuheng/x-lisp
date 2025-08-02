import { type Exp } from "../exp/index.ts"

export type Stmt = Compute | Define | Import | Assert

export type Compute = {
  kind: "Compute"
  exp: Exp
}

export type Define = {
  kind: "Define"
  name: string
  exp: Exp
}

export type Import = {
  kind: "Import"
  path: string
  entries: Array<ImportEntry>
}

export type ImportEntry = {
  name: string
  rename?: string
}

export type Assert = {
  kind: "Assert"
  exp: Exp
}

export function Compute(exp: Exp): Compute {
  return {
    kind: "Compute",
    exp,
  }
}

export function Define(name: string, exp: Exp): Define {
  return {
    kind: "Define",
    name,
    exp,
  }
}

export function Import(path: string, entries: Array<ImportEntry>): Import {
  return {
    kind: "Import",
    path,
    entries,
  }
}

export function Assert(exp: Exp): Assert {
  return {
    kind: "Assert",
    exp,
  }
}
