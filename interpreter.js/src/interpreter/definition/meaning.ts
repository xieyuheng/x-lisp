import { emptyEnv } from "../env/Env.ts"
import { evaluate, resultValue, validateOrFail } from "../evaluate/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Value } from "../value/index.ts"
import { type Definition } from "./Definition.ts"

export function meaning(mod: Mod, definition: Definition): Value {
  switch (definition.kind) {
    case "ValueDefinition": {
      if (definition.validatedValue) {
        return definition.validatedValue
      } else if (definition.schema) {
        definition.validatedValue = validateOrFail(
          definition.schema,
          definition.value,
        )
        return meaning(mod, definition)
      } else {
        return definition.value
      }
    }

    case "LazyDefinition": {
      if (definition.validatedValue) {
        return definition.validatedValue
      } else if (definition.value && definition.schema) {
        definition.validatedValue = validateOrFail(
          definition.schema,
          definition.value,
        )
        return meaning(mod, definition)
      } else if (definition.value) {
        return definition.value
      } else {
        definition.value = resultValue(
          evaluate(definition.exp)(definition.origin, emptyEnv()),
        )
        return meaning(mod, definition)
      }
    }
  }
}
