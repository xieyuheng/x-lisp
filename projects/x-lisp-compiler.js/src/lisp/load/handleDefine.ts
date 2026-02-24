import * as L from "../index.ts"
import { expandDataConstructor } from "./expandDataConstructor.ts"
import { expandDataGetter } from "./expandDataGetter.ts"
import { expandDataPutter } from "./expandDataPutter.ts"

export function handleDefine(mod: L.Mod, stmt: L.Stmt): void {
  if (stmt.kind === "Claim") {
    L.modClaim(mod, stmt.name, stmt.type)
  }

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

  if (stmt.kind === "DefineType") {
    L.modDefine(
      mod,
      stmt.name,
      L.TypeDefinition(mod, stmt.name, stmt.body, stmt.meta),
    )
  }

  if (stmt.kind === "DefineDatatype") {
    L.modDefine(
      mod,
      stmt.datatypeConstructor.name,
      L.DatatypeDefinition(
        mod,
        stmt.datatypeConstructor.name,
        stmt.datatypeConstructor,
        stmt.dataConstructors,
        stmt.meta,
      ),
    )

    for (const ctor of stmt.dataConstructors) {
      expandDataConstructor(mod, ctor)
      expandDataGetter(mod, ctor)
      expandDataPutter(mod, ctor)
    }
  }
}
