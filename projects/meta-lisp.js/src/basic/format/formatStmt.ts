import type { Block } from "../block/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { formatInstr } from "./formatInstr.ts"

export function formatStmt(stmt: Stmt): string {
  switch (stmt.kind) {
    case "DefineFunction": {
      const name = stmt.name
      const parameters = stmt.parameters.join(" ")
      const blocks = Array.from(stmt.blocks.values().map(formatBlock)).join(" ")
      return `(define-function (${name} ${parameters}) ${blocks})`
    }

    case "DefineVariable": {
      const name = stmt.name
      const blocks = Array.from(stmt.blocks.values().map(formatBlock)).join(" ")
      return `(define-variable ${name} ${blocks})`
    }

    case "Import": {
      return `(import "${stmt.modName}" ${stmt.names.join(" ")})`
    }

    case "ImportAs": {
      return `(import-as "${stmt.modName}" ${stmt.prefix})`
    }
  }
}

function formatBlock(block: Block): string {
  const instrs = block.instrs.map(formatInstr).join(" ")
  return `(block ${block.label} ${instrs})`
}
