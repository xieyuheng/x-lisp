import * as Ppml from "@xieyuheng/ppml.js"
import * as X86 from "../index.ts"
import { prettyData } from "./prettyData.ts"
import { prettyInstr } from "./prettyInstr.ts"

export function prettyStmt(stmt: X86.Stmt): Ppml.Node {
  switch (stmt.kind) {
    case "DefineCodeStmt": {
      const instrNodes = stmt.instrs.map(prettyInstr)
      return Ppml.prettyVertical(
        "define-code",
        [Ppml.text(stmt.name)],
        instrNodes,
      )
    }
    case "DefineDataStmt":
      return Ppml.prettySyntax(
        "define-data",
        [Ppml.text(stmt.name)],
        [prettyData(stmt.value)],
      )
    case "DefineStructStmt": {
      const fieldNodes = Object.keys(stmt.fields).map((name) =>
        Ppml.text(`(${name} ${X86.formatType(stmt.fields[name])})`),
      )
      return Ppml.prettySyntax(
        "define-struct",
        [Ppml.text(stmt.name)],
        fieldNodes,
      )
    }
    case "DefineSpaceStmt":
      return Ppml.prettySyntax(
        "define-space",
        [Ppml.text(stmt.name)],
        [prettyData(stmt.size)],
      )
  }
}
