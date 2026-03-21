import * as L from "../index.ts"

export function expandDataConstructorPredicate(
  mod: L.Mod,
  definition: L.DataDefinition,
  dataConstructor: L.DataConstructor,
): void {
  const name = `${dataConstructor.name}?`

  mod.exempted.add(name)

  if (dataConstructor.fields.length === 0) {
    L.modDefine(
      mod,
      name,
      L.FunctionDefinition(
        mod,
        name,
        ["value"],
        L.Apply(L.Var("equal?"), [
          L.Var("value"),
          L.Symbol(dataConstructor.name),
        ]),
      ),
    )
  } else {
    L.modDefine(
      mod,
      name,
      L.FunctionDefinition(
        mod,
        name,
        ["value"],
        L.And([
          L.Apply(L.Var("list?"), [L.Var("value")]),
          L.Apply(L.Var("equal?"), [
            L.Apply(L.Var("list-length"), [L.Var("value")]),
            L.Int(BigInt(dataConstructor.fields.length + 1)),
          ]),
          L.Apply(L.Var("equal?"), [
            L.Apply(L.Var("list-head"), [L.Var("value")]),
            L.Symbol(dataConstructor.name),
          ]),
        ]),
      ),
    )
  }

  if (definition.dataTypeConstructor.parameters.length === 0) {
    L.modClaim(mod, name, L.Arrow([L.Var(definition.name)], L.Var("bool-t")))
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
          L.Var("bool-t"),
        ),
      ),
    )
  }
}
