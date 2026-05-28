import * as Ppml from "@xieyuheng/ppml.js"
import * as M from "../index.ts"
import {
  prettyFragmentStmts,
  prettyModDefinitions,
} from "./prettyMod.ts"


export function formatPrettyFragmentStmts(
  width: number,
  stmts: Array<M.Stmt<M.Exp>>,
): string {
  return prettyFragmentStmts(stmts)
    .map((node) => Ppml.formatNode(node, { width }))
    .join("\n\n")
}

export function formatPrettyModDefinitions(width: number, mod: M.Mod): string {
  return prettyModDefinitions(mod)
    .map((node) => Ppml.formatNode(node, { width }))
    .join("\n\n")
}
