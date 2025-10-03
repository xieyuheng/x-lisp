import { emptyEnv } from "../env/Env.ts"
import { evaluate, resultValue, validateOrFail } from "../evaluate/index.ts"
import { type Value } from "../value/index.ts"
import { type Definition } from "./Definition.ts"

export type Mod = {
  url: URL
  claimed: Map<string, Value>
  defined: Map<string, Definition>
  exported: Set<string>
}

export function createMod(url: URL): Mod {
  return {
    url,
    claimed: new Map(),
    defined: new Map(),
    exported: new Set(),
  }
}

export function modNames(mod: Mod): Set<string> {
  return new Set(mod.defined.keys())
}

export function modLookupValue(mod: Mod, name: string): Value | undefined {
  const definition = mod.defined.get(name)
  if (definition === undefined) {
    return undefined
  }

  switch (definition.kind) {
    case "ValueDefinition": {
      if (definition.validatedValue) {
        return definition.validatedValue
      } else if (definition.schema) {
        const validatedValue = validateOrFail(
          definition.schema,
          definition.value,
        )
        definition.validatedValue = validatedValue
        return validatedValue
      } else {
        return definition.value
      }
    }

    case "LazyDefinition": {
      if (definition.validatedValue) {
        return definition.validatedValue
      } else if (definition.value && definition.schema) {
        const validatedValue = validateOrFail(
          definition.schema,
          definition.value,
        )
        definition.validatedValue = validatedValue
        return validatedValue
      } else if (definition.value) {
        return definition.value
      } else {
        const value = resultValue(
          evaluate(definition.exp)(definition.origin, emptyEnv()),
        )
        definition.value = value
        if (definition.schema) {
          const validatedValue = validateOrFail(
            definition.schema,
            definition.value,
          )
          definition.validatedValue = validatedValue
          return validatedValue
        } else {
          return definition.value
        }
      }
    }
  }
}

export function modLookupDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  const defined = mod.defined.get(name)
  if (defined) return defined

  return undefined
}

export function modLookupPublicDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  if (!mod.exported.has(name)) return undefined
  return modLookupDefinition(mod, name)
}

export function modPublicDefinitions(mod: Mod): Map<string, Definition> {
  const definitions: Map<string, Definition> = new Map()
  for (const [name, definition] of mod.defined.entries()) {
    if (mod.exported.has(name)) {
      definitions.set(name, definition)
    }
  }

  return definitions
}
