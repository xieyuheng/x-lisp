import * as L from "../index.ts"

export function expandDataConstructor(
  mod: L.Mod,
  ctor: L.DataConstructorSpec,
): void {
  generateDataConstructor(mod, ctor)
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
