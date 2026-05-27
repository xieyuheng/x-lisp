import * as Ppml from "@xieyuheng/ppml.js"
import * as M from "../index.ts"
import { prettyExp } from "./prettyExp.ts"
import {
  prettyFragmentStmts,
  prettyModDefinitions,
  prettyModStmts,
} from "./prettyMod.ts"

export function formatPrettyExp(width: number, exp: M.Exp): string {
  return Ppml.format(prettyExp(exp), { width })
}

export function formatPrettyModStmts(width: number, mod: M.Mod): string {
  return Ppml.format(prettyModStmts(mod), { width })
}

export function formatPrettyFragmentStmts(
  width: number,
  stmts: Array<M.Stmt<M.Exp>>,
): string {
  return prettyFragmentStmts(stmts)
    .map((node) => Ppml.format(node, { width }))
    .join("\n\n")
}

export function formatPrettyModDefinitions(width: number, mod: M.Mod): string {
  return prettyModDefinitions(mod)
    .map((node) => Ppml.format(node, { width }))
    .join("\n\n")
}
