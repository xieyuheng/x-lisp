import {
  type Mod,
  modImport,
  modLookupPublicDefinition,
  modPublicDefinitions,
} from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"

export function stage2(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Import") {
    const importedMod = modImport(mod, stmt.path)
    for (const entry of stmt.entries) {
      const definition = modLookupPublicDefinition(importedMod, entry.name)
      if (definition === undefined) {
        let message = `(import) undefined name: ${entry.name}\n`
        message += `  path: ${stmt.path}\n`
        throw new Error(message)
      }

      const name = entry.rename || entry.name
      mod.imported.set(name, definition)
    }
  }

  if (stmt.kind === "ImportAll") {
    const importedMod = modImport(mod, stmt.path)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      mod.imported.set(name, definition)
    }
  }

  if (stmt.kind === "ImportAs") {
    const importedMod = modImport(mod, stmt.path)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      mod.imported.set(`${stmt.name}/${name}`, definition)
    }
  }

  if (stmt.kind === "Include") {
    const importedMod = modImport(mod, stmt.path)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      mod.included.set(name, definition)
    }
  }

  if (stmt.kind === "IncludeOnly") {
    const importedMod = modImport(mod, stmt.path)
    for (const name of stmt.names) {
      const definition = modLookupPublicDefinition(importedMod, name)
      if (definition === undefined) {
        let message = `(include-only) undefined name: ${name}\n`
        message += `  path: ${stmt.path}\n`
        throw new Error(message)
      }

      mod.included.set(name, definition)
    }
  }

  if (stmt.kind === "IncludeExcept") {
    const importedMod = modImport(mod, stmt.path)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      if (!stmt.names.includes(name)) {
        mod.included.set(name, definition)
      }
    }
  }
}
