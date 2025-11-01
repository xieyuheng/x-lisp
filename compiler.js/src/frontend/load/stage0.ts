import assert from "node:assert"
import { FunctionDefinition } from "../definition/index.ts"
import * as Exps from "../exp/index.ts"
import { modLookupDefinition, type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"

export function stage0(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Compute") {
    const found = modLookupDefinition(mod, "main")
    if (found) {
      assert(found.body.kind === "Begin")
      found.body.sequence.push(stmt.exp)
    } else {
      const sequence = [stmt.exp]
      const main = FunctionDefinition("main", [], Exps.Begin(sequence))
      mod.defined.set("main", main)
    }
  }
}
