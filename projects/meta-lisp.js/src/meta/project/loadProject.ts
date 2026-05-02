import fs from "node:fs"
import Path from "node:path"
import * as M from "../index.ts"

export function loadProject(configPath?: string): M.Project {
  configPath = configPath || Path.join(process.cwd(), "project.json")
  const config = M.loadProjectConfig(configPath)
  const rootDirectory = Path.resolve(Path.dirname(configPath))
  const project = M.createProject(rootDirectory, config)

  M.loadBuiltinMod(project)

  const sourceDirectory = M.projectSourceDirectory(project)
  for (const name of fs.readdirSync(sourceDirectory, {
    encoding: "utf-8",
    recursive: true,
  })) {
    if (name.endsWith(".meta")) {
      const path = Path.join(sourceDirectory, name)
      const fragment = M.loadModFragment(path)
      M.projectPutFragment(project, path, fragment)
    }
  }

  return project
}
