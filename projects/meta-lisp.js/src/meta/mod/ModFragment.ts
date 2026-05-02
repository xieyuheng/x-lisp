export type ModFragment = {
  importedNames: Map<string, { modName: string; name: string }>
  importedPrefixes: Map<string, { modName: string }>
}

export function createModFragment(): ModFragment {
  return {
    importedNames: new Map(),
    importedPrefixes: new Map(),
  }
}

export function modFragmentFilterBoundNames(
  fragment: ModFragment,
  boundNames: Set<string>,
): ModFragment {
  const importedNames: Map<string, { modName: string; name: string }> =
    new Map()
  for (const [key, entry] of fragment.importedNames) {
    if (!boundNames.has(key)) {
      importedNames.set(key, entry)
    }
  }

  return {
    importedNames,
    importedPrefixes: fragment.importedPrefixes,
  }
}

export function modFragmentDropImportedNames(
  fragment: ModFragment,
): ModFragment {
  return {
    importedNames: new Map(),
    importedPrefixes: fragment.importedPrefixes,
  }
}
