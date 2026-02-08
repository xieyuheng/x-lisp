import * as S from "@xieyuheng/sexp.js"
import * as Definitions from "../definition/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { expandDataConstructor } from "./expand.ts"

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

  if (stmt.kind === "DefineVariable") {
    if (mod.definitions.has(stmt.name)) {
      let message = `[stage1/DefineVariable] can not redefine`
      message += `\n  name: ${stmt.name}`
      throw new S.ErrorWithMeta(message, stmt.meta)
    }

    mod.definitions.set(
      stmt.name,
      Definitions.VariableDefinition(mod, stmt.name, stmt.body, stmt.meta),
    )
  }

  if (stmt.kind === "DefineData") {
    for (const ctor of stmt.constructors) {
      expandDataConstructor(mod, ctor)
    }
  }
}
