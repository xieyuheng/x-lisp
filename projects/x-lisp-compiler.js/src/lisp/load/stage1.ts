import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"

export function stage1(mod: L.Mod, stmt: L.Stmt): void {
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
      L.FunctionDefinition(
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
      L.VariableDefinition(mod, stmt.name, stmt.body, stmt.meta),
    )
  }

  if (stmt.kind === "DefineData") {
    // L.expandDataPredicate(mod, stmt)
    for (const ctor of stmt.constructors) {
      L.expandDataConstructor(mod, ctor)
      L.expandDataConstructorPredicate(mod, ctor)
      L.expandDataGetter(mod, ctor)
      L.expandDataPutter(mod, ctor)
    }
  }
}
