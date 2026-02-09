import * as L from "../index.ts"

export function expandDataConstructor(
  mod: L.Mod,
  ctor: L.DataConstructorSpec,
): void {
  const name = ctor.name
  if (ctor.fields.length === 0) {
    L.modDefine(mod, name, L.VariableDefinition(mod, name, L.Hashtag(name)))
  } else {
    const parameters = ctor.fields.map((field) => field.name)
    const args = parameters.map((name) => L.Var(name))
    L.modDefine(
      mod,
      name,
      L.FunctionDefinition(
        mod,
        name,
        parameters,
        L.Tael([L.Hashtag(name), ...args], {}),
      ),
    )
  }
}

export function expandDataGetter(
  mod: L.Mod,
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
  }
}

export function expandDataPutter(
  mod: L.Mod,
  ctor: L.DataConstructorSpec,
): void {
  for (const [index, field] of ctor.fields.entries()) {
    const name = `${ctor.name}-put-${field.name}`
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
  }

  for (const [index, field] of ctor.fields.entries()) {
    const name = `${ctor.name}-put-${field.name}!`
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
  }
}

export function expandDataConstructorPredicate(
  mod: L.Mod,
  ctor: L.DataConstructorSpec,
): void {
  const name = `${ctor.name}?`
  if (ctor.fields.length === 0) {
    L.modDefine(
      mod,
      name,
      L.FunctionDefinition(
        mod,
        name,
        ["value"],
        L.Apply(L.Var("equal?"), [L.Var("value"), L.Hashtag(ctor.name)]),
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
          L.Apply(L.Var("any-list?"), [L.Var("value")]),
          L.Apply(L.Var("equal?"), [
            L.Apply(L.Var("list-length"), [L.Var("value")]),
            L.Int(BigInt(ctor.fields.length + 1)),
          ]),
          L.Apply(L.Var("equal?"), [
            L.Apply(L.Var("list-head"), [L.Var("value")]),
            L.Hashtag(ctor.name),
          ]),
        ]),
      ),
    )
  }
}

export function expandDataPredicate(mod: L.Mod, stmt: L.DefineData): void {
  const name = stmt.predicate.name
  L.modDefine(
    mod,
    name,
    L.FunctionDefinition(
      mod,
      name,
      [...stmt.predicate.parameters, "value"],
      L.Or(stmt.constructors.map((ctor) => expandDataPredicateCase(mod, ctor))),
    ),
  )
}

function expandDataPredicateCase(
  mod: L.Mod,
  ctor: L.DataConstructorSpec,
): L.Exp {
  if (ctor.fields.length === 0) {
    return L.Apply(L.Var(`${ctor.name}?`), [L.Var("value")])
  } else {
    return L.And([
      L.Apply(L.Var(`${ctor.name}?`), [L.Var("value")]),
      ...ctor.fields.map((field) =>
        L.Apply(field.predicate, [
          L.Apply(L.Var(`${ctor.name}-${field.name}`), [L.Var("value")]),
        ]),
      ),
    ])
  }
}
