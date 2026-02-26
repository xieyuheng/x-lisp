import * as L from "../index.ts"

export function expandDataPutter(
  mod: L.Mod,
  definition: L.DatatypeDefinition,
  ctor: L.DataConstructorSpec,
): void {
  for (const [index, field] of ctor.fields.entries()) {
    const name = `${ctor.name}-put-${field.name}`

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

    if (definition.datatypeConstructor.parameters.length === 0) {
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
          definition.datatypeConstructor.parameters,
          L.Arrow(
            [
              field.type,
              L.Apply(
                L.Var(definition.name),
                definition.datatypeConstructor.parameters.map((parameter) =>
                  L.Var(parameter),
                ),
              ),
            ],
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

  for (const [index, field] of ctor.fields.entries()) {
    const name = `${ctor.name}-put-${field.name}!`

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

    if (definition.datatypeConstructor.parameters.length === 0) {
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
          definition.datatypeConstructor.parameters,
          L.Arrow(
            [
              field.type,
              L.Apply(
                L.Var(definition.name),
                definition.datatypeConstructor.parameters.map((parameter) =>
                  L.Var(parameter),
                ),
              ),
            ],
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
