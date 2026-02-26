import * as L from "../index.ts"

export function expandDataGetter(
  mod: L.Mod,
  definition: L.DatatypeDefinition,
  ctor: L.DataConstructorSpec,
): void {
  for (const [index, field] of ctor.fields.entries()) {
    const name = `${ctor.name}-${field.name}`
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

    if (definition.datatypeConstructor.parameters.length === 0) {
      L.modClaim(mod, name, L.Arrow([L.Var(definition.name)], field.type))
    } else {
      L.modClaim(
        mod,
        name,
        L.Polymorphic(
          definition.datatypeConstructor.parameters,
          L.Arrow(
            [
              L.Apply(
                L.Var(definition.name),
                definition.datatypeConstructor.parameters.map((parameter) =>
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
