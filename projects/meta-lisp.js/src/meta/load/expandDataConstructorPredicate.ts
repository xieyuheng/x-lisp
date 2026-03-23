import * as M from "../index.ts"

export function expandDataConstructorPredicate(
  mod: M.Mod,
  definition: M.DataDefinition,
  dataConstructor: M.DataConstructor,
): void {
  const name = `${dataConstructor.name}?`

  mod.exempted.add(name)

  if (dataConstructor.fields.length === 0) {
    M.modDefine(
      mod,
      name,
      M.FunctionDefinition(
        mod,
        name,
        ["value"],
        M.Apply(M.Var("equal?"), [
          M.Var("value"),
          M.Symbol(dataConstructor.name),
        ]),
      ),
    )
  } else {
    M.modDefine(
      mod,
      name,
      M.FunctionDefinition(
        mod,
        name,
        ["value"],
        M.And([
          M.Apply(M.Var("list?"), [M.Var("value")]),
          M.Apply(M.Var("equal?"), [
            M.Apply(M.Var("list-length"), [M.Var("value")]),
            M.Int(BigInt(dataConstructor.fields.length + 1)),
          ]),
          M.Apply(M.Var("equal?"), [
            M.Apply(M.Var("list-head"), [M.Var("value")]),
            M.Symbol(dataConstructor.name),
          ]),
        ]),
      ),
    )
  }

  if (definition.dataTypeConstructor.parameters.length === 0) {
    M.modClaim(mod, name, M.Arrow([M.Var(definition.name)], M.Var("bool-t")))
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
          M.Var("bool-t"),
        ),
      ),
    )
  }
}
