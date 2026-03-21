import * as L from "../index.ts"
import { expandDataConstructor } from "./expandDataConstructor.ts"
import { expandDataConstructorPredicate } from "./expandDataConstructorPredicate.ts"
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

  if (stmt.kind === "DefineData") {
    const name = stmt.dataTypeConstructor.name
    const dataTypeConstructor =
      stmt.dataTypeConstructor as unknown as L.DataTypeConstructor
    const dataConstructors =
      stmt.dataConstructors as unknown as Array<L.DataConstructor>
    const definition = L.DataDefinition(
      mod,
      name,
      dataTypeConstructor,
      dataConstructors,
      stmt.meta,
    )
    dataTypeConstructor.definition = definition
    for (const dataConstructor of dataConstructors) {
      dataConstructor.definition = definition
    }

    L.modDefine(mod, name, definition)

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
      stmt.interfaceConstructor as unknown as L.InterfaceConstructor
    const attributeTypes = stmt.attributeTypes
    const definition = L.InterfaceDefinition(
      mod,
      name,
      interfaceConstructor,
      attributeTypes,
      stmt.meta,
    )
    interfaceConstructor.definition = definition
    L.modDefine(mod, name, definition)
  }
}
