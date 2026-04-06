import Path from "node:path"
import * as M from "../index.ts"
import { createProject, type Project } from "./index.ts"

export function projectFromSourcePaths(
  entryPath: string,
  sourcePaths: Array<string>,
): Project {
  const rootDirectory = Path.dirname(entryPath)
  const project = createProject(rootDirectory, {
    name: "*",
    version: "*",
    build: {
      "source-directory": ".",
    },
  })

  project.sourceIds = sourcePaths
    .filter((path) => path !== M.builtinModPath)
    .map((path) => Path.relative(rootDirectory, path))

  return project
}
