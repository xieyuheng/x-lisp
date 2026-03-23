import * as M from "../index.ts"

export function expandDataGetter(
  mod: M.Mod,
  definition: M.DataDefinition,
  dataConstructor: M.DataConstructor,
): void {
  for (const [index, field] of dataConstructor.fields.entries()) {
    const name = `${dataConstructor.name}-${field.name}`

    mod.exempted.add(name)

    M.modDefine(
      mod,
      name,
      M.FunctionDefinition(
        mod,
        name,
        ["target"],
        M.Apply(M.Var("list-get"), [M.Int(BigInt(index + 1)), M.Var("target")]),
      ),
    )

    if (definition.dataTypeConstructor.parameters.length === 0) {
      M.modClaim(mod, name, M.Arrow([M.Var(definition.name)], field.type))
    } else {
      M.modClaim(
        mod,
        name,
        M.Polymorphic(
          definition.dataTypeConstructor.parameters,
          M.Arrow(
            [
              M.Apply(
                M.Var(definition.name),
                definition.dataTypeConstructor.parameters.map((parameter) =>
                  M.Var(parameter),
                ),
              ),
            ],
            field.type,
          ),
        ),
      )
    }
  }
}
