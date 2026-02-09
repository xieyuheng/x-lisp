import { type Mod } from "../mod/index.ts"
import { formatDefinition } from "./formatDefinition.ts"
import { formatStmt } from "./formatStmt.ts"

export function formatModStmts(mod: Mod): string {
  return mod.stmts.map(formatStmt).join(" ")
}

export function formatModDefinitions(mod: Mod): string {
  const definitions = mod.definitions
    .values()
    .filter(
      (definition) =>
        definition.kind !== "PrimitiveFunctionDefinition" &&
        definition.kind !== "PrimitiveVariableDefinition",
    )
    .map(formatDefinition)

  return Array.from(definitions).join(" ")
}
