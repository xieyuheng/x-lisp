import { range } from "@xieyuheng/helpers.js/range"
import * as M from "../index.ts"
import { expandDataConstructor } from "./expandDataConstructor.ts"
import { expandDataConstructorPredicate } from "./expandDataConstructorPredicate.ts"
import { expandDataGetter } from "./expandDataGetter.ts"
import { expandDataPutter } from "./expandDataPutter.ts"

export function prepareDefine(
  mod: M.Mod,
  state: M.LoadingState,
  stmt: M.Stmt,
): void {
  if (stmt.kind === "Claim") {
    M.modClaim(mod, stmt.name, stmt.type)
  }

  if (stmt.kind === "DefineFunction") {
    M.modDefine(
      mod,
      stmt.name,
      M.FunctionDefinition(
        mod,
        stmt.name,
        stmt.parameters,
        stmt.body,
        stmt.location,
      ),
    )
  }

  if (stmt.kind === "DefineVariable") {
    M.modDefine(
      mod,
      stmt.name,
      M.VariableDefinition(mod, stmt.name, stmt.body, stmt.location),
    )
  }

  if (stmt.kind === "DefineData") {
    const name = stmt.dataTypeConstructor.name
    const dataTypeConstructor =
      stmt.dataTypeConstructor as unknown as M.DataTypeConstructor
    const dataConstructors =
      stmt.dataConstructors as unknown as Array<M.DataConstructor>
    const definition = M.DataDefinition(
      mod,
      name,
      dataTypeConstructor,
      dataConstructors,
      stmt.location,
    )
    dataTypeConstructor.definition = definition
    for (const dataConstructor of dataConstructors) {
      dataConstructor.definition = definition
    }

    M.modDefine(mod, name, definition)

    if (dataTypeConstructor.parameters.length === 0) {
      M.modClaim(mod, name, M.Var("type-t"))
    } else {
      M.modClaim(
        mod,
        name,
        M.Arrow(
          range(dataTypeConstructor.parameters.length).map((_) =>
            M.Var("type-t"),
          ),
          M.Var("type-t"),
        ),
      )
    }

    for (const dataConstructor of dataConstructors) {
      mod.dataConstructors.set(dataConstructor.name, dataConstructor)
    }

    for (const dataConstructor of dataConstructors) {
      expandDataConstructor(mod, definition, dataConstructor)
      expandDataConstructorPredicate(mod, definition, dataConstructor)
      expandDataGetter(mod, definition, dataConstructor)
      expandDataPutter(mod, definition, dataConstructor)
    }
  }

  if (stmt.kind === "DefineInterface") {
    const name = stmt.interfaceConstructor.name
    const interfaceConstructor =
      stmt.interfaceConstructor as unknown as M.InterfaceConstructor
    const attributeTypes = stmt.attributeTypes
    const definition = M.InterfaceDefinition(
      mod,
      name,
      interfaceConstructor,
      attributeTypes,
      stmt.location,
    )
    interfaceConstructor.definition = definition
    M.modDefine(mod, name, definition)

    if (interfaceConstructor.parameters.length === 0) {
      M.modClaim(mod, name, M.Var("type-t"))
    } else {
      M.modClaim(
        mod,
        name,
        M.Arrow(
          range(interfaceConstructor.parameters.length).map((_) =>
            M.Var("type-t"),
          ),
          M.Var("type-t"),
        ),
      )
    }
  }
}
