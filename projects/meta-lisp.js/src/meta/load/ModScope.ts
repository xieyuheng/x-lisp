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
