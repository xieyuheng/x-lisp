import * as Ppml from "@xieyuheng/ppml.js"
import * as M from "../index.ts"

export function formatPrettyFragmentStmts(
  width: number,
  stmts: Array<M.Stmt<M.Exp>>,
): string {
  return M.prettyFragmentStmts(stmts)
    .map((node) => Ppml.formatNode(node, { width }))
    .join("\n\n")
}
