import * as Ppml from "@xieyuheng/ppml.js"
import * as X86 from "../index.ts"
import { prettyBlock } from "./prettyBlock.ts"
import { prettyData } from "./prettyData.ts"

export function prettyStmt(stmt: X86.Stmt): Ppml.Node {
  switch (stmt.kind) {
    case "DefineCodeStmt": {
      const blockNodes = stmt.blocks.map(prettyBlock)
      return Ppml.prettyVertical(
        "define-code",
        [Ppml.text(stmt.name)],
        blockNodes,
      )
    }
    case "DefineDataStmt":
      return Ppml.prettySyntax(
        "define-data",
        [Ppml.text(stmt.name)],
        [prettyData(stmt.value)],
      )
    case "DefineMetadataStmt":
      return Ppml.prettySyntax(
        "define-metadata",
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
