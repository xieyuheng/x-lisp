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
