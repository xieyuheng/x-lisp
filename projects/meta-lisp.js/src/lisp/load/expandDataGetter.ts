import * as L from "../index.ts"

export function expandDataGetter(
  mod: L.Mod,
  definition: L.DataDefinition,
  dataConstructor: L.DataConstructor,
): void {
  for (const [index, field] of dataConstructor.fields.entries()) {
    const name = `${dataConstructor.name}-${field.name}`

    mod.exempted.add(name)

    L.modDefine(
      mod,
      name,
      L.FunctionDefinition(
        mod,
        name,
        ["target"],
        L.Apply(L.Var("list-get"), [L.Int(BigInt(index + 1)), L.Var("target")]),
      ),
    )

    if (definition.dataTypeConstructor.parameters.length === 0) {
      L.modClaim(mod, name, L.Arrow([L.Var(definition.name)], field.type))
    } else {
      L.modClaim(
        mod,
        name,
        L.Polymorphic(
          definition.dataTypeConstructor.parameters,
          L.Arrow(
            [
              L.Apply(
                L.Var(definition.name),
                definition.dataTypeConstructor.parameters.map((parameter) =>
                  L.Var(parameter),
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
