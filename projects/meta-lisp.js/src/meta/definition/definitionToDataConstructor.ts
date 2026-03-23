import * as M from "../index.ts"

export function definitionToDataConstructor(
  definition: M.Definition,
): M.DataConstructor | undefined {
  return definition.mod.dataConstructors.get(definition.name)
}

export function definitionIsDataConstructor(definition: M.Definition): boolean {
  return Boolean(definitionToDataConstructor(definition))
}
