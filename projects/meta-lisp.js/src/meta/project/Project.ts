import * as M from "../index.ts"
import { type ProjectConfig } from "./ProjectConfig.ts"

export type Project = {
  mods: Map<string, M.Mod>
  rootDirectory: string
  config: ProjectConfig
  sourceIds?: Array<string>
}

export function createProject(
  rootDirectory: string,
  config: ProjectConfig,
): Project {
  return {
    mods: new Map(),
    rootDirectory,
    config,
  }
}

export function projectLookupMod(
  project: Project,
  name: string,
): M.Mod | undefined {
  return project.mods.get(name)
}

export function projectAddMod(project: Project, mod: M.Mod): void {
  project.mods.set(mod.name, mod)
}

export function projectMods(project: Project): Array<M.Mod> {
  return Array.from(project.mods.values())
}

export function projectModNames(project: Project): Array<string> {
  const mods = projectMods(project)
  return mods.map((mod) => mod.name)
}

export function projectForEachMod(
  project: Project,
  callback: (mod: M.Mod) => void,
): void {
  for (const mod of project.mods.values()) {
    callback(mod)
  }
}

export function projectForEachDefinition(
  project: Project,
  callback: (definition: M.Definition) => void,
): void {
  M.projectForEachMod(project, (mod) => {
    M.modForEachOwnDefinition(mod, callback)
  })
}
