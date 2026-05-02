export type ModScope = {
  importedNames: Map<string, { modName: string; name: string }>
  importedPrefixes: Map<string, { modName: string }>
}

export function createModScope(): ModScope {
  return {
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
    importedNames,
    importedPrefixes: scope.importedPrefixes,
  }
}

export function modScopeDropImportedNames(scope: ModScope): ModScope {
  return {
    importedNames: new Map(),
    importedPrefixes: scope.importedPrefixes,
  }
}
