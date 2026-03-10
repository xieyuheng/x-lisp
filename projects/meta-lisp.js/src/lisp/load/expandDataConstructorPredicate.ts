import * as L from "../index.ts"

export function expandDataConstructorPredicate(
  mod: L.Mod,
  definition: L.DatatypeDefinition,
  ctor: L.DataConstructorSpec,
): void {
  const name = `${ctor.name}?`

  mod.exempted.add(name)

  if (ctor.fields.length === 0) {
    L.modDefine(
      mod,
      name,
      L.FunctionDefinition(
        mod,
        name,
        ["value"],
        L.Apply(L.Var("equal?"), [L.Var("value"), L.Symbol(ctor.name)]),
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
            L.Int(BigInt(ctor.fields.length + 1)),
          ]),
          L.Apply(L.Var("equal?"), [
            L.Apply(L.Var("list-head"), [L.Var("value")]),
            L.Symbol(ctor.name),
          ]),
        ]),
      ),
    )
  }

  if (definition.datatypeConstructor.parameters.length === 0) {
    L.modClaim(mod, name, L.Arrow([L.Var(definition.name)], L.Var("bool-t")))
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
          L.Var("bool-t"),
        ),
      ),
    )
  }
}
