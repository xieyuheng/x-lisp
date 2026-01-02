import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import * as Definitions from "../definition/index.ts"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"
import { modLookupDefinition, type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"

export function stage1(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Export") {
    for (const name of stmt.names) {
      mod.exported.add(name)
    }
  }

  if (stmt.kind === "DefineFunction") {
    if (mod.definitions.has(stmt.name)) {
      let message = `[stage1/DefineFunction] can not redefine`
      message += `\n  name: ${stmt.name}`
      throw new S.ErrorWithMeta(message, stmt.meta)
    }

    mod.definitions.set(
      stmt.name,
      Definitions.FunctionDefinition(
        mod,
        stmt.name,
        stmt.parameters,
        stmt.body,
        stmt.meta,
      ),
    )
  }

  if (stmt.kind === "DefineConstant") {
    if (mod.definitions.has(stmt.name)) {
      let message = `[stage1/DefineConstant] can not redefine`
      message += `\n  name: ${stmt.name}`
      throw new S.ErrorWithMeta(message, stmt.meta)
    }

    mod.definitions.set(
      stmt.name,
      Definitions.ConstantDefinition(mod, stmt.name, stmt.body, stmt.meta),
    )
  }

  if (stmt.kind === "Compute") {
    const exp = wrapTopLevelExp(stmt.exp)
    const mainName = "_main"
    const found = modLookupDefinition(mod, mainName)
    if (found) {
      assert(found.body.kind === "BeginSugar")
      found.body.sequence.push(exp)
    } else {
      mod.definitions.set(
        mainName,
        Definitions.FunctionDefinition(
          mod,
          mainName,
          [],
          Exps.BeginSugar([exp], stmt.meta),
          stmt.meta,
        ),
      )
    }
  }
}

function wrapTopLevelExp(exp: Exp): Exp {
  return Exps.ApplySugar(Exps.Var("println-non-void"), [exp])
}
