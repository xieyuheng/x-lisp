import assert from "node:assert"
import * as L from "../index.ts"

export function unfoldDatatypeType(datatypeType: L.Value): L.Value {
  assert(L.isDatatypeType(datatypeType))
  const definition = L.datatypeTypeDatatypeDefinition(datatypeType)
  const argTypes = L.datatypeTypeArgTypes(datatypeType)

  const env = L.envPutMany(
    L.emptyEnv(),
    definition.datatypeConstructor.parameters,
    argTypes,
  )

  const variantTypes: Record<string, L.Value> = {}
  for (const dataConstructor of definition.dataConstructors) {
    const elementTypes = dataConstructor.fields.map((field) =>
      L.evaluate(definition.mod, env, field.type),
    )

    variantTypes[dataConstructor.name] = L.createTauType(
      [L.HashtagValue(dataConstructor.name), ...elementTypes],
      {},
    )
  }

  return L.createDisjointUnionType(variantTypes)
}
