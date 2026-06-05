import * as Ppml from "@xieyuheng/ppml.js"
import * as M from "../index.ts"
import { prettyDefinition } from "./prettyDefinition.ts"
import { prettyExp, prettyTerm } from "./prettyExp.ts"
import { prettyStmt } from "./prettyStmt.ts"

export function prettyModStmts(mod: M.Mod): Ppml.Node {
  const nodes = mod.stmts.map((stmt) => prettyStmt(stmt, prettyExp))

  if (nodes.length === 0) {
    return Ppml.nil()
  }

  let result = Ppml.group(nodes[0])
  for (const node of nodes.slice(1)) {
    result = Ppml.concat(result, Ppml.group(Ppml.br(), Ppml.br(), node))
  }
  return result
}

export function prettyFragmentStmts(
  stmts: Array<M.Stmt<M.Exp>>,
): Array<Ppml.Node> {
  return stmts.map((stmt) => prettyStmt(stmt, prettyExp))
}

export function prettyFragmentDesugaredStmts(
  stmts: Array<M.Stmt<M.Term>>,
): Array<Ppml.Node> {
  return stmts.map((stmt) => prettyStmt(stmt, prettyTerm))
}

export function prettyModDefinitions(mod: M.Mod): Array<Ppml.Node> {
  const definitions = Array.from(mod.definitions.values())
  return definitions.flatMap(prettyDefinition)
}
