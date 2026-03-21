import * as L from "../index.ts"

export function expandDataPutter(
  mod: L.Mod,
  definition: L.DataDefinition,
  dataConstructor: L.DataConstructor,
): void {
  for (const [index, field] of dataConstructor.fields.entries()) {
    const name = `${dataConstructor.name}-put-${field.name}`

    mod.exempted.add(name)

    L.modDefine(
      mod,
      name,
      L.FunctionDefinition(
        mod,
        name,
        ["value", "target"],
        L.Apply(L.Var("list-put"), [
          L.Int(BigInt(index + 1)),
          L.Var("value"),
          L.Var("target"),
        ]),
      ),
    )

    if (definition.dataTypeConstructor.parameters.length === 0) {
      L.modClaim(
        mod,
        name,
        L.Arrow([field.type, L.Var(definition.name)], L.Var(definition.name)),
      )
    } else {
      L.modClaim(
        mod,
        name,
        L.Polymorphic(
          definition.dataTypeConstructor.parameters,
          L.Arrow(
            [
              field.type,
              L.Apply(
                L.Var(definition.name),
                definition.dataTypeConstructor.parameters.map((parameter) =>
                  L.Var(parameter),
                ),
              ),
            ],
            L.Apply(
              L.Var(definition.name),
              definition.dataTypeConstructor.parameters.map((parameter) =>
                L.Var(parameter),
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

    L.modDefine(
      mod,
      name,
      L.FunctionDefinition(
        mod,
        name,
        ["value", "target"],
        L.Apply(L.Var("list-put!"), [
          L.Int(BigInt(index + 1)),
          L.Var("value"),
          L.Var("target"),
        ]),
      ),
    )

    if (definition.dataTypeConstructor.parameters.length === 0) {
      L.modClaim(
        mod,
        name,
        L.Arrow([field.type, L.Var(definition.name)], L.Var(definition.name)),
      )
    } else {
      L.modClaim(
        mod,
        name,
        L.Polymorphic(
          definition.dataTypeConstructor.parameters,
          L.Arrow(
            [
              field.type,
              L.Apply(
                L.Var(definition.name),
                definition.dataTypeConstructor.parameters.map((parameter) =>
                  L.Var(parameter),
                ),
              ),
            ],
            L.Apply(
              L.Var(definition.name),
              definition.dataTypeConstructor.parameters.map((parameter) =>
                L.Var(parameter),
              ),
            ),
          ),
        ),
      )
    }
  }
}
