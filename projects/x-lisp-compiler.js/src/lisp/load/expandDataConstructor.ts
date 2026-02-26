import * as L from "../index.ts"

export function expandDataConstructor(
  mod: L.Mod,
  definition: L.DatatypeDefinition,
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
