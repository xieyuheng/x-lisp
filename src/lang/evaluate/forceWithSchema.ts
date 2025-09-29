import assert from "node:assert"
import { useBuiltinMod } from "../builtin/index.ts"
import { formatValue } from "../format/index.ts"
import { modLookupValue } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { applyPolymorphic } from "./applyPolymorphic.ts"
import { force } from "./force.ts"
import { validateOrFail } from "./validate.ts"

export function forceWithSchema(schema: Value, target: Value): Value {
  schema = Values.lazyWalk(schema)
  target = Values.lazyWalk(target)

  if (schema.kind === "Polymorphic") {
    const preludeMod = useBuiltinMod()
    const anything = modLookupValue(preludeMod, "anything?")
    assert(anything)
    return forceWithSchema(
      applyPolymorphic(
        schema,
        schema.parameters.map((_) => anything),
      ),
      target,
    )
  }

  if (schema.kind === "Arrow" && schema.argSchemas.length === 0) {
    return validateOrFail(schema.retSchema, force(target))
  }

  let message = `[forceWithSchema] unhandled kind of schema\n`
  message += `  schema: ${formatValue(schema)}\n`
  message += `  target: ${formatValue(target)}\n`
  throw new Error(message)
}
