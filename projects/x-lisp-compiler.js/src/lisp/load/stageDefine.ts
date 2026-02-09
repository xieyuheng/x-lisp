import * as L from "../index.ts"

export function stageDefine(mod: L.Mod, stmt: L.Stmt): void {
  if (stmt.kind === "DefineFunction") {
    L.modDefine(
      mod,
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
    L.modDefine(
      mod,
      stmt.name,
      L.VariableDefinition(mod, stmt.name, stmt.body, stmt.meta),
    )
  }

  if (stmt.kind === "DefineData") {
    L.expandDataPredicate(mod, stmt)
    for (const ctor of stmt.constructors) {
      L.expandDataConstructor(mod, ctor)
      L.expandDataConstructorPredicate(mod, ctor)
      L.expandDataGetter(mod, ctor)
      L.expandDataPutter(mod, ctor)
    }
  }
}
