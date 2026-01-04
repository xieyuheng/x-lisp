import type { Mod } from "../mod/index.ts"
import * as Stmts from "../stmt/index.ts"
import { prettyStmt } from "./prettyStmt.ts"

export function prettyMod(width: number, mod: Mod): string {
  let s = ``

  for (const stmt of mod.stmts.filter(Stmts.isAboutImport)) {
    s += prettyStmt(width, stmt)
    s += "\n"
  }

  if (mod.stmts.filter(Stmts.isAboutImport).length != 0) {
    s += "\n"
  }

  for (const stmt of mod.stmts.filter((stmt) => stmt.kind === "Export")) {
    s += prettyStmt(width, stmt)
    s += "\n"
  }

  if (mod.stmts.filter((stmt) => stmt.kind === "Export").length != 0) {
    s += "\n"
  }

  for (const stmt of mod.stmts.filter((stmt) => !Stmts.isAboutImport(stmt))) {
    s += prettyStmt(width, stmt)
    s += "\n"
    s += "\n"
  }

  return s
}
