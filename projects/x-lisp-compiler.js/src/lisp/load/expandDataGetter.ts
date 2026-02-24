import * as L from "../index.ts"

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
