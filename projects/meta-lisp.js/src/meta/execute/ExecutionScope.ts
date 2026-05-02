export type ExecutionScope = {
  importedNames: Map<string, { modName: string; name: string }>
  importedPrefixes: Map<string, { modName: string }>
}

export function createExecutionScope(): ExecutionScope {
  return {
    importedNames: new Map(),
    importedPrefixes: new Map(),
  }
}

export function executionScopeFilterBoundNames(
  scope: ExecutionScope,
  boundNames: Set<string>,
): ExecutionScope {
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

export function executionScopeDropImportedNames(
  scope: ExecutionScope,
): ExecutionScope {
  return {
    importedNames: new Map(),
    importedPrefixes: scope.importedPrefixes,
  }
}
