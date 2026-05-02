import Path from "node:path"
import * as M from "../index.ts"

export type Project = {
  fragments: Map<string, M.ModFragment>
  mods: Map<string, M.Mod>
  rootDirectory: string
  config: M.ProjectConfig
}

export function createProject(
  rootDirectory: string,
  config: M.ProjectConfig,
): Project {
  return {
    fragments: new Map(),
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

export function projectSourceDirectory(project: M.Project): string {
  return Path.resolve(
    project.rootDirectory,
    project.config["build"]["source-directory"],
  )
}

export function projectOutputDirectory(project: M.Project): string {
  return project.config["build"]["output-directory"]
    ? Path.resolve(
        project.rootDirectory,
        project.config["build"]["output-directory"],
      )
    : projectSourceDirectory(project)
}

export function projectSnapshotDirectory(project: M.Project): string {
  return project.config["build"]["snapshot-directory"]
    ? Path.resolve(
        project.rootDirectory,
        project.config["build"]["snapshot-directory"],
      )
    : projectSourceDirectory(project)
}
