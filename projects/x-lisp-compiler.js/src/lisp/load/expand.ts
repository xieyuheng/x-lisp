import * as L from "../index.ts"

export function expandDataConstructor(
  mod: L.Mod,
  ctor: L.DataConstructorSpec,
): void {
  generateDataConstructor(mod, ctor)
  generateDataGetter(mod, ctor)
  generateDataPutter(mod, ctor)
  generateDataConstructorPredicate(mod, ctor)
}

export function generateDataConstructor(
  mod: L.Mod,
  ctor: L.DataConstructorSpec,
): void {
  const arity = ctor.fields.length
  const name = ctor.name
  if (arity === 0) {
    mod.definitions.set(name, L.VariableDefinition(mod, name, L.Hashtag(name)))
  } else {
    const parameters = ctor.fields.map((field) => field.name)
    const args = parameters.map((name) => L.Var(name))
    mod.definitions.set(
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

export function generateDataGetter(
  mod: L.Mod,
  ctor: L.DataConstructorSpec,
): void {
  for (const [index, field] of ctor.fields.entries()) {
    const name = `${ctor.name}-${field.name}`
    mod.definitions.set(
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

export function generateDataPutter(
  mod: L.Mod,
  ctor: L.DataConstructorSpec,
): void {
  for (const [index, field] of ctor.fields.entries()) {
    const name = `${ctor.name}-put-${field.name}`
    mod.definitions.set(
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
    mod.definitions.set(
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

export function generateDataConstructorPredicate(
  mod: L.Mod,
  ctor: L.DataConstructorSpec,
): void {
  const arity = ctor.fields.length
  const name = `${ctor.name}?`
  if (arity === 0) {
    mod.definitions.set(
      name,
      L.FunctionDefinition(
        mod,
        name,
        ["value"],
        L.Apply(L.Var("equal?"), [L.Var("value"), L.Hashtag(ctor.name)]),
      ),
    )
  } else {
    mod.definitions.set(
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
