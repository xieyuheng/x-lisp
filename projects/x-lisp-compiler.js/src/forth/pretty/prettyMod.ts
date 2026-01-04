import type { Mod } from "../mod/index.ts"
import * as Stmts from "../stmt/index.ts"
import { prettyStmt } from "./prettyStmt.ts"

export function prettyMod(mod: Mod, options: { width: number, }): string {
  let s = ``

  for (const stmt of mod.stmts.filter(Stmts.isAboutImport)) {
    s += prettyStmt(stmt, options)
    s += "\n"
  }

  if (mod.stmts.filter(Stmts.isAboutImport).length != 0) {
    s += "\n"
  }

  for (const stmt of mod.stmts.filter((stmt) => stmt.kind === "Export")) {
    s += prettyStmt(stmt, options)
    s += "\n"
  }

  if (mod.stmts.filter((stmt) => stmt.kind === "Export").length != 0) {
    s += "\n"
  }

  for (const stmt of mod.stmts.filter((stmt) => !Stmts.isAboutImport(stmt))) {
    s += prettyStmt(stmt, options)
    s += "\n"
    s += "\n"
  }

  return s
}
