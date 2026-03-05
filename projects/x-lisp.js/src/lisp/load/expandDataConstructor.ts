import * as L from "../index.ts"

export function expandDataConstructor(
  mod: L.Mod,
  definition: L.DatatypeDefinition,
  ctor: L.DataConstructorSpec,
): void {
  mod.exempted.add(ctor.name)

  if (ctor.fields.length === 0) {
    L.modDefine(
      mod,
      ctor.name,
      L.VariableDefinition(mod, ctor.name, L.Hashtag(ctor.name)),
    )

    if (definition.datatypeConstructor.parameters.length === 0) {
      L.modClaim(mod, ctor.name, L.Var(definition.name))
    } else {
      L.modClaim(
        mod,
        ctor.name,
        L.Polymorphic(
          definition.datatypeConstructor.parameters,
          L.Apply(
            L.Var(definition.name),
            definition.datatypeConstructor.parameters.map((parameter) =>
              L.Var(parameter),
            ),
          ),
        ),
      )
    }
  } else {
    const parameters = ctor.fields.map((field) => field.name)
    const args = parameters.map((name) => L.Var(name))
    L.modDefine(
      mod,
      ctor.name,
      L.FunctionDefinition(
        mod,
        ctor.name,
        parameters,
        L.Tael([L.Hashtag(ctor.name), ...args], {}),
      ),
    )

    if (definition.datatypeConstructor.parameters.length === 0) {
      L.modClaim(
        mod,
        ctor.name,
        L.Arrow(
          ctor.fields.map((field) => field.type),
          L.Var(definition.name),
        ),
      )
    } else {
      L.modClaim(
        mod,
        ctor.name,
        L.Polymorphic(
          definition.datatypeConstructor.parameters,
          L.Arrow(
            ctor.fields.map((field) => field.type),
            L.Apply(
              L.Var(definition.name),
              definition.datatypeConstructor.parameters.map((parameter) =>
                L.Var(parameter),
              ),
            ),
          ),
        ),
      )
    }
  }
}
