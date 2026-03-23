import * as M from "../index.ts"

export function expandDataConstructor(
  mod: M.Mod,
  definition: M.DataDefinition,
  dataConstructor: M.DataConstructor,
): void {
  mod.exempted.add(dataConstructor.name)

  if (dataConstructor.fields.length === 0) {
    M.modDefine(
      mod,
      dataConstructor.name,
      M.VariableDefinition(
        mod,
        dataConstructor.name,
        M.Symbol(dataConstructor.name),
      ),
    )

    if (definition.dataTypeConstructor.parameters.length === 0) {
      M.modClaim(mod, dataConstructor.name, M.Var(definition.name))
    } else {
      M.modClaim(
        mod,
        dataConstructor.name,
        M.Polymorphic(
          definition.dataTypeConstructor.parameters,
          M.Apply(
            M.Var(definition.name),
            definition.dataTypeConstructor.parameters.map((parameter) =>
              M.Var(parameter),
            ),
          ),
        ),
      )
    }
  } else {
    const parameters = dataConstructor.fields.map((field) => field.name)
    const args = parameters.map((name) => M.Var(name))
    M.modDefine(
      mod,
      dataConstructor.name,
      M.FunctionDefinition(
        mod,
        dataConstructor.name,
        parameters,
        M.LiteralList([M.Symbol(dataConstructor.name), ...args]),
      ),
    )

    if (definition.dataTypeConstructor.parameters.length === 0) {
      M.modClaim(
        mod,
        dataConstructor.name,
        M.Arrow(
          dataConstructor.fields.map((field) => field.type),
          M.Var(definition.name),
        ),
      )
    } else {
      M.modClaim(
        mod,
        dataConstructor.name,
        M.Polymorphic(
          definition.dataTypeConstructor.parameters,
          M.Arrow(
            dataConstructor.fields.map((field) => field.type),
            M.Apply(
              M.Var(definition.name),
              definition.dataTypeConstructor.parameters.map((parameter) =>
                M.Var(parameter),
              ),
            ),
          ),
        ),
      )
    }
  }
}
