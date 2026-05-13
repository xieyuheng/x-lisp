export type ModInfo = {
  definedNames: Map<string, Set<string>>
  privateNames: Map<string, Set<string>>
  fragmentScopes: Map<string, FragmentScope>
}

export type FragmentScope = {
  importedNames: Map<string, { modName: string; name: string }>
  importedPrefixes: Map<string, { modName: string }>
}
