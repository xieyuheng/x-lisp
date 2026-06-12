import * as Ppml from "@xieyuheng/ppml.js"
import * as X86 from "../index.ts"
import { prettyBlock } from "./prettyBlock.ts"
import { prettyExp } from "./prettyExp.ts"

export function prettyStmt(stmt: X86.Stmt): Ppml.Node {
  switch (stmt.kind) {
    case "DefineCodeStmt": {
      const blockNodes = stmt.blocks.map(prettyBlock)
      return Ppml.prettySyntax(
        "define-code",
        [Ppml.text(stmt.name)],
        blockNodes,
      )
    }
    case "DefineDataStmt": {
      const fieldNodes = stmt.fields.map((f) =>
        Ppml.prettySyntax("", [], [Ppml.text(f.name), prettyExp(f.exp)]),
      )
      return Ppml.prettySyntax(
        "define-data",
        [Ppml.text(stmt.name)],
        fieldNodes,
      )
    }
    case "DefineMetadataStmt": {
      const fieldNodes = stmt.fields.map((f) =>
        Ppml.prettySyntax("", [], [Ppml.text(f.name), prettyExp(f.exp)]),
      )
      return Ppml.prettySyntax(
        "define-metadata",
        [Ppml.text(stmt.name)],
        fieldNodes,
      )
    }
    case "DefineStructStmt": {
      const fieldNodes = stmt.fields.map((f) =>
        Ppml.prettySyntax("", [], [Ppml.text(f.name), prettyExp(f.exp)]),
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
        [prettyExp(stmt.size)],
      )
    case "ClaimStmt":
      return Ppml.prettySyntax(
        "claim",
        [Ppml.text(stmt.name)],
        [prettyExp(stmt.type)],
      )
    case "ClaimCodeMetadataStmt":
      return Ppml.prettySyntax(
        "claim-code-metadata",
        [],
        [prettyExp(stmt.type)],
      )
  }
}
