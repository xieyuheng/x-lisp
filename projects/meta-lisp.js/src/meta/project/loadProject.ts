import * as M from "../index.ts"
import fs from "node:fs"
import Path from "node:path"

export function loadProject(configPath?: string): M.Project {
  configPath = configPath || Path.join(process.cwd(), "project.json")
  const config = M.loadProjectConfig(configPath)
  const rootDirectory = Path.resolve(Path.dirname(configPath))
  const project = M.createProject(rootDirectory, config)

  M.loadBuiltinMod(project)

  const sourceDirectory = M.projectSourceDirectory(project)
  for (const path of fs.readdirSync(sourceDirectory, {
    encoding: "utf-8",
    recursive: true,
  })) {
    if (path.endsWith(".meta")) {
      M.loadCode(project, Path.join(sourceDirectory, path))
    }
  }

  return project
}
