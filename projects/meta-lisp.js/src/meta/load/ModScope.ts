import * as M from "../index.ts"

export type ModScope = {
  mod: M.Mod
  importedNames: Map<string, { modName: string; name: string }>
  importedPrefixes: Map<string, { modName: string }>
}

export function createModScope(mod: M.Mod): ModScope {
  return {
    mod,
    importedNames: new Map(),
    importedPrefixes: new Map(),
  }
}

export function modScopeFilterBoundNames(
  scope: ModScope,
  boundNames: Set<string>,
): ModScope {
  const importedNames: Map<string, { modName: string; name: string }> =
    new Map()
  for (const [key, entry] of scope.importedNames) {
    if (!boundNames.has(key)) {
      importedNames.set(key, entry)
    }
  }

  return {
    mod: scope.mod,
    importedNames,
    importedPrefixes: scope.importedPrefixes,
  }
}

export function modScopeDropImportedNames(scope: ModScope): ModScope {
  return {
    mod: scope.mod,
    importedNames: new Map(),
    importedPrefixes: scope.importedPrefixes,
  }
}
