import * as L from "../index.ts"

export function expandDataConstructor(
  mod: L.Mod,
  definition: L.DatatypeDefinition,
  dataConstructor: L.DataConstructor,
): void {
  mod.exempted.add(dataConstructor.name)

  if (dataConstructor.fields.length === 0) {
    L.modDefine(
      mod,
      dataConstructor.name,
      L.VariableDefinition(
        mod,
        dataConstructor.name,
        L.Symbol(dataConstructor.name),
      ),
    )

    if (definition.datatypeConstructor.parameters.length === 0) {
      L.modClaim(mod, dataConstructor.name, L.Var(definition.name))
    } else {
      L.modClaim(
        mod,
        dataConstructor.name,
        L.Polymorphic(
          definition.datatypeConstructor.parameters,
          L.Apply(
            L.Var(definition.name),
            definition.datatypeConstructor.parameters.map((parameter) =>
              L.Var(parameter),
            ),
          ),
        ),
      )
    }
  } else {
    const parameters = dataConstructor.fields.map((field) => field.name)
    const args = parameters.map((name) => L.Var(name))
    L.modDefine(
      mod,
      dataConstructor.name,
      L.FunctionDefinition(
        mod,
        dataConstructor.name,
        parameters,
        L.LiteralList([L.Symbol(dataConstructor.name), ...args]),
      ),
    )

    if (definition.datatypeConstructor.parameters.length === 0) {
      L.modClaim(
        mod,
        dataConstructor.name,
        L.Arrow(
          dataConstructor.fields.map((field) => field.type),
          L.Var(definition.name),
        ),
      )
    } else {
      L.modClaim(
        mod,
        dataConstructor.name,
        L.Polymorphic(
          definition.datatypeConstructor.parameters,
          L.Arrow(
            dataConstructor.fields.map((field) => field.type),
            L.Apply(
              L.Var(definition.name),
              definition.datatypeConstructor.parameters.map((parameter) =>
                L.Var(parameter),
              ),
            ),
          ),
        ),
      )
    }
  }
}
