import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"

export function setupType(mod: L.Mod): void {
  for (const definition of L.modOwnDefinitions(mod)) {
    if (definition.kind === "TypeDefinition") {
      const value = L.evaluate(mod, L.emptyEnv(), definition.body)
      if (!L.isType(value) && !L.isClosureValue(value)) {
        let message = `[setupType] value is not a type`
        message += `\n  body: ${L.formatExp(definition.body)}`
        message += `\n  value: ${L.formatValue(value)}`
        if (definition.meta) throw new S.ErrorWithMeta(message, definition.meta)
        else throw new Error(message)
      }

      definition.value = value
    }
  }
}
