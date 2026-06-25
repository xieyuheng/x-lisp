import * as X86 from "../index.ts"
import { formatBlock } from "./formatBlock.ts"
import { formatExp } from "./formatExp.ts"

export function formatStmt(stmt: X86.Stmt): string {
  switch (stmt.kind) {
    case "DefineCodeStmt": {
      const blocks = stmt.blocks.map(formatBlock).join(" ")
      return `(define-code ${stmt.name} ${blocks})`
    }
    case "DefineDataStmt":
      return `(define-data ${stmt.name} ${formatExp(stmt.value)})`
    case "DefineMetadataStmt":
      return `(define-metadata ${stmt.name} ${formatExp(stmt.value)})`
    case "DefineStructStmt": {
      const fields = stmt.fields
        .map((f) => `(${f.name} ${formatExp(f.exp)})`)
        .join(" ")
      return `(define-struct ${stmt.name} ${fields})`
    }
    case "DefineSpaceStmt":
      return `(define-space ${stmt.name} ${formatExp(stmt.size)})`
  }
}
