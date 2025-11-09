import * as S from "@xieyuheng/x-sexp.js"
import assert from "node:assert"
import { FunctionDefinition } from "../definition/index.ts"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"
import { modLookupDefinition, type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"

function wrapTopLevelExp(exp: Exp): Exp {
  return Exps.Apply(Exps.Var("println-non-void"), [exp])
}

export function stage1(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Compute") {
    const exp = wrapTopLevelExp(stmt.exp)
    const found = modLookupDefinition(mod, "main")
    if (found) {
      assert(found.body.kind === "BeginSugar")
      found.body.sequence.push(exp)
    } else {
      const body = Exps.BeginSugar([exp], stmt.meta)
      const main = FunctionDefinition(mod, "main", [], body, stmt.meta)
      mod.definitions.set("main", main)
    }
  }

  if (stmt.kind === "DefineFunction") {
    if (mod.definitions.has(stmt.name)) {
      let message = `[stage1/DefineFunction] can not redefine`
      message += `\n  name: ${stmt.name}`
      throw new S.ErrorWithMeta(message, stmt.meta)
    } else {
      mod.definitions.set(
        stmt.name,
        FunctionDefinition(
          mod,
          stmt.name,
          stmt.parameters,
          stmt.body,
          stmt.meta,
        ),
      )
    }
  }
}
