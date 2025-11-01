import * as X from "@xieyuheng/x-sexp.js"
import { FunctionDefinition } from "../definition/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"

export function stage1(mod: Mod, stmt: Stmt): void {
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
