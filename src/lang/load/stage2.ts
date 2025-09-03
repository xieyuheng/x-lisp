import { urlRelativeToCwd } from "../../utils/url/urlRelativeToCwd.ts"
import { include } from "../define/index.ts"
import {
  type Mod,
  modLookupPublicDefinition,
  modPublicDefinitions,
} from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { importByMod } from "./importByMod.ts"

export function stage2(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Import") {
    const importedMod = importByMod(stmt.path, mod)
    for (const entry of stmt.entries) {
      const definition = modLookupPublicDefinition(importedMod, entry.name)
      if (definition === undefined) {
        let message = `(import) undefined name: ${entry.name}\n`
        message += `  path: ${stmt.path}\n`
        message += `  by mod: ${urlRelativeToCwd(mod.url)}\n`
        throw new Error(message)
      }

      const name = entry.rename || entry.name
      mod.defined.set(name, definition)
    }
  }

  if (stmt.kind === "ImportAll") {
    const importedMod = importByMod(stmt.path, mod)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      mod.defined.set(name, definition)
    }
  }

  if (stmt.kind === "ImportAs") {
    const importedMod = importByMod(stmt.path, mod)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      mod.defined.set(`${stmt.name}/${name}`, definition)
    }
  }

  if (stmt.kind === "IncludeAll") {
    const importedMod = importByMod(stmt.path, mod)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      include(mod, name, definition)
    }
  }

  if (stmt.kind === "Include") {
    const importedMod = importByMod(stmt.path, mod)
    for (const name of stmt.names) {
      const definition = modLookupPublicDefinition(importedMod, name)
      if (definition === undefined) {
        let message = `(include) undefined name: ${name}\n`
        message += `  path: ${stmt.path}\n`
        message += `  by mod: ${urlRelativeToCwd(mod.url)}\n`
        throw new Error(message)
      }

      include(mod, name, definition)
    }
  }

  if (stmt.kind === "IncludeExcept") {
    const importedMod = importByMod(stmt.path, mod)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      if (!stmt.names.includes(name)) {
        include(mod, name, definition)
      }
    }
  }

  if (stmt.kind === "IncludeAs") {
    const importedMod = importByMod(stmt.path, mod)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      include(mod, `${stmt.name}/${name}`, definition)
    }
  }
}
