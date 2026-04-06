import { systemShellRun } from "@xieyuheng/helpers.js/system"
import * as M from "../index.ts"
import { BasicInterpreterFile } from "./BasicInterpreterFile.ts"
import {
  logPath,
  projectBuild,
  projectGetBasicPath,
  projectGetSourcePath,
  projectSourceIds,
  type Project,
} from "./index.ts"

export function projectTest(
  project: Project,
  dependencyGraph: M.DependencyGraph,
): void {
  projectBuild(project, dependencyGraph)

  for (const id of projectSourceIds(project)) {
    if (id.endsWith(".test.meta")) {
      const inputFile = projectGetBasicPath(project, id)
      logPath("test", id)
      systemShellRun(BasicInterpreterFile, ["run", inputFile])
    }
  }

  for (const id of projectSourceIds(project)) {
    if (id.endsWith(".snapshot.meta")) {
      const inputFile = projectGetBasicPath(project, id)
      const outputFile = projectGetSourcePath(project, id) + ".out"
      logPath("snapshot", id)
      systemShellRun(BasicInterpreterFile, ["run", inputFile, ">", outputFile])
    }
  }

  for (const id of projectSourceIds(project)) {
    if (id.endsWith(".error.meta")) {
      const inputFile = projectGetBasicPath(project, id)
      const outputFile = projectGetSourcePath(project, id) + ".err"
      logPath("error-snapshot", id)
      systemShellRun(BasicInterpreterFile, [
        "run",
        inputFile,
        ">",
        outputFile,
        "||",
        "true",
      ])
    }
  }
}
