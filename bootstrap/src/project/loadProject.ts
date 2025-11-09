import fs from "node:fs"
import Path from "path"
import { loadProjectConfig } from "./loadProjectConfig.ts"
import type { Project } from "./Project.ts"

export async function loadProject(configFile: string): Promise<Project> {
  const config = await loadProjectConfig(configFile)
  const rootDirectory = Path.resolve(Path.dirname(configFile))
  const sourceDirectory = Path.resolve(
    rootDirectory,
    config["build"]["source-directory"],
  )
  const sourceFiles = fs
    .readdirSync(sourceDirectory, { encoding: "utf8", recursive: true })
    .filter((file) => file.endsWith(".lisp"))

  return {
    rootDirectory,
    config,
    sourceFiles,
  }
}
