import * as L from "../index.ts"

export function expandDataPutter(
  mod: L.Mod,
  definition: L.DatatypeDefinition,
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
