import * as X86 from "../index.ts"

export function CheckPass(mod: X86.Mod): void {
  checkDuplicateNames(mod)
  checkDataFields(mod)
}

function checkDuplicateNames(mod: X86.Mod): void {
  for (const [name, definition] of mod.definitions) {
    if (
      Array.from(mod.definitions.keys()).filter((k) => k === name).length > 1
    ) {
      let message = `[CheckPass] duplicate definition: ${name}`
      throw new Error(message)
    }
  }
}

function checkDataFields(mod: X86.Mod): void {
  for (const [, definition] of mod.definitions) {
    if (definition.kind !== "DataDefinition") continue
    X86.check(mod, definition.value, X86.inferDataType(mod, definition.value))
  }
}
