import * as N from "../index.ts"
import { formatBlock } from "./formatBlock.ts"
import { formatExp } from "./formatExp.ts"

export function formatStmt(stmt: N.Stmt): string {
  switch (stmt.kind) {
    case "DefineCodeStmt": {
      const blocks = stmt.blocks.map(formatBlock).join(" ")
      return `(define-code ${stmt.name} ${blocks})`
    }
    case "DefineDataStmt": {
      const fields = stmt.fields
        .map((f) => `(${f.name} ${formatExp(f.exp)})`)
        .join(" ")
      return `(define-data ${stmt.name} ${fields})`
    }
    case "DefineMetadataStmt": {
      const fields = stmt.fields
        .map((f) => `(${f.name} ${formatExp(f.exp)})`)
        .join(" ")
      return `(define-metadata ${stmt.name} ${fields})`
    }
    case "DefineStructStmt": {
      const fields = stmt.fields
        .map((f) => `(${f.name} ${formatExp(f.exp)})`)
        .join(" ")
      return `(define-struct ${stmt.name} ${fields})`
    }
    case "DefineSpaceStmt":
      return `(define-space ${stmt.name} ${formatExp(stmt.size)})`
    case "ClaimStmt":
      return `(claim ${stmt.name} ${formatExp(stmt.type)})`
    case "ClaimCodeMetadataStmt":
      return `(claim-code-metadata ${formatExp(stmt.type)})`
  }
}
