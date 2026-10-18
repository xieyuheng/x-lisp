import * as X86 from "../index.ts"
import { formatData } from "./formatData.ts"
import { formatInstr } from "./formatInstr.ts"

export function formatStmt(stmt: X86.Stmt): string {
  switch (stmt.kind) {
    case "DefineCodeStmt": {
      const instrs = stmt.instrs.map(formatInstr).join(" ")
      return `(define-code ${stmt.name} ${instrs})`
    }
    case "DefineDataStmt":
      return `(define-data ${stmt.name} ${formatData(stmt.value)})`
    case "DefineStructStmt": {
      const fields = Object.keys(stmt.fields)
        .map((name) => `(${name} ${X86.formatType(stmt.fields[name])})`)
        .join(" ")
      return `(define-struct ${stmt.name} ${fields})`
    }
    case "DefineSpaceStmt":
      return `(define-space ${stmt.name} ${formatData(stmt.size)})`
  }
}
