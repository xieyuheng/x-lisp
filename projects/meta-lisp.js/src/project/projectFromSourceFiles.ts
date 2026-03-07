import Path from "node:path"
import { createProject, type Project } from "./index.ts"

export function projectFromSourceFiles(
  entryFile: string,
  sourceFiles: Array<string>,
): Project {
  const rootDirectory = Path.dirname(entryFile)
  const project = createProject(rootDirectory, {
    name: "*",
    version: "*",
    build: {
      "source-directory": rootDirectory,
    },
  })
  project.sourceIds = sourceFiles.map((file) =>
    Path.relative(rootDirectory, file),
  )

  return project
}
