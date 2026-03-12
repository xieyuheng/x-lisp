import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"

export function isPattern(mod: L.Mod, exp: L.Exp): boolean {
  return isVarPattern(mod, exp) || isDataPattern(mod, exp)
}

// VarPattern

export function isVarPattern(mod: L.Mod, exp: L.Exp): boolean {
  return false
}

// DataPattern

export function isDataPattern(mod: L.Mod, exp: L.Exp): boolean {
  return false
}
