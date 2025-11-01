import * as X from "@xieyuheng/x-sexp.js"
import assert from "node:assert"
import { FunctionDefinition } from "../definition/index.ts"
import * as Exps from "../exp/index.ts"
import { modLookupDefinition, type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"

export function stage1(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Compute") {
    const found = modLookupDefinition(mod, "main")
    if (found) {
      assert(found.body.kind === "BeginSugar")
      found.body.sequence.push(stmt.exp)
    } else {
      const sequence = [stmt.exp]
      const main = FunctionDefinition(
        "main",
        [],
        Exps.BeginSugar(sequence, stmt.meta),
        stmt.meta,
      )
      mod.defined.set("main", main)
    }
  }

  if (stmt.kind === "DefineFunction") {
    if (mod.defined.has(stmt.name)) {
      let message = `[stage1/DefineFunction] can not redefine`
      message += `\n  name: ${stmt.name}`
      throw new X.ErrorWithMeta(message, stmt.meta)
    } else {
      mod.defined.set(
        stmt.name,
        FunctionDefinition(stmt.name, stmt.parameters, stmt.body, stmt.meta),
      )
    }
  }
}
