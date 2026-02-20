import * as L from "../index.ts"

export function unfoldDatatypeValue(
  datatype: L.DatatypeValue,
): L.DisjointUnionValue {
  const env = L.envPutMany(
    L.emptyEnv(),
    datatype.definition.datatypeConstructor.parameters,
    datatype.args,
  )
  const types: Record<string, L.Value> = {}
  for (const dataConstructor of datatype.definition.dataConstructors) {
    const elementTypes = dataConstructor.fields.map((field) =>
      L.resultValue(L.evaluate(datatype.definition.mod, env, field.type)),
    )

    types[dataConstructor.name] = L.TaelValue(
      [
        L.HashtagValue("tau"),
        L.HashtagValue(dataConstructor.name),
        ...elementTypes,
      ],
      {},
    )
  }

  return L.DisjointUnionValue(types)
}
