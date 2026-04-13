import type { Block } from "../block/index.ts"
import * as B from "../index.ts"
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

    case "DbTransect": {
      const bindings = stmt.bindings.join(" ")
      const operations = Array.from(
        stmt.operations.map(formatDbOperation),
      ).join(" ")
      return `(db-transact (${bindings}) ${operations})`
    }
  }
}

function formatBlock(block: Block): string {
  const instrs = block.instrs.map(formatInstr).join(" ")
  return `(block ${block.label} ${instrs})`
}

function formatDbOperation(operation: B.DbOperation): string {
  switch (operation.kind) {
    case "DbAdd": {
      const e = formatDbExp(operation.e)
      const a = formatDbExp(operation.a)
      const v = formatDbExp(operation.v)
      return `(add ${e} ${a} ${v})`
    }

    case "DbDelete": {
      const e = formatDbExp(operation.e)
      const a = formatDbExp(operation.a)
      const v = formatDbExp(operation.v)
      return `(delete ${e} ${a} ${v})`
    }

    case "DbDeleteAttribute": {
      const e = formatDbExp(operation.e)
      const a = formatDbExp(operation.a)
      return `(delete-attribute ${e} ${a})`
    }

    case "DbDeleteEntity": {
      const e = formatDbExp(operation.e)
      return `(delete-entity ${e})`
    }

    case "DbPut": {
      const e = formatDbExp(operation.e)
      const a = formatDbExp(operation.a)
      const v = formatDbExp(operation.v)
      return `(put ${e} ${a} ${v})`
    }

    case "DbPutUnique": {
      const e = formatDbExp(operation.e)
      const a = formatDbExp(operation.a)
      const v = formatDbExp(operation.v)
      return `(put-unique ${e} ${a} ${v})`
    }
  }
}

function formatDbExp(exp: B.DbExp): string {
  return B.formatExp(exp)
}
