import * as M from "../index.ts"

export function expandDataPutter(
  mod: M.Mod,
  definition: M.DataDefinition,
  dataConstructor: M.DataConstructor,
): void {
  for (const [index, field] of dataConstructor.fields.entries()) {
    const name = `${dataConstructor.name}-put-${field.name}`

    mod.exempted.add(name)

    M.modDefine(
      mod,
      name,
      M.FunctionDefinition(
        mod,
        name,
        ["value", "target"],
        M.Apply(M.Var("list-put"), [
          M.Int(BigInt(index + 1)),
          M.Var("value"),
          M.Var("target"),
        ]),
      ),
    )

    if (definition.dataTypeConstructor.parameters.length === 0) {
      M.modClaim(
        mod,
        name,
        M.Arrow([field.type, M.Var(definition.name)], M.Var(definition.name)),
      )
    } else {
      M.modClaim(
        mod,
        name,
        M.Polymorphic(
          definition.dataTypeConstructor.parameters,
          M.Arrow(
            [
              field.type,
              M.Apply(
                M.Var(definition.name),
                definition.dataTypeConstructor.parameters.map((parameter) =>
                  M.Var(parameter),
                ),
              ),
            ],
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

  for (const [index, field] of dataConstructor.fields.entries()) {
    const name = `${dataConstructor.name}-put-${field.name}!`

    mod.exempted.add(name)

    M.modDefine(
      mod,
      name,
      M.FunctionDefinition(
        mod,
        name,
        ["value", "target"],
        M.Apply(M.Var("list-put!"), [
          M.Int(BigInt(index + 1)),
          M.Var("value"),
          M.Var("target"),
        ]),
      ),
    )

    if (definition.dataTypeConstructor.parameters.length === 0) {
      M.modClaim(
        mod,
        name,
        M.Arrow([field.type, M.Var(definition.name)], M.Var(definition.name)),
      )
    } else {
      M.modClaim(
        mod,
        name,
        M.Polymorphic(
          definition.dataTypeConstructor.parameters,
          M.Arrow(
            [
              field.type,
              M.Apply(
                M.Var(definition.name),
                definition.dataTypeConstructor.parameters.map((parameter) =>
                  M.Var(parameter),
                ),
              ),
            ],
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
