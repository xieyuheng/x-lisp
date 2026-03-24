import { systemShellRun } from "@xieyuheng/helpers.js/system"
import * as M from "../meta/index.ts"
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
      logPath("basic-test", inputFile)
      systemShellRun(BasicInterpreterFile, ["run", inputFile])
    }
  }

  for (const id of projectSourceIds(project)) {
    if (id.endsWith(".snapshot.meta")) {
      const inputFile = projectGetBasicPath(project, id)
      const outputFile = projectGetSourcePath(project, id) + ".out"
      logPath("basic-snapshot", outputFile)
      systemShellRun(BasicInterpreterFile, ["run", inputFile, ">", outputFile])
    }
  }

  for (const id of projectSourceIds(project)) {
    if (id.endsWith(".error.meta")) {
      const inputFile = projectGetBasicPath(project, id)
      const outputFile = projectGetSourcePath(project, id) + ".err"
      logPath("basic-error-snapshot", outputFile)
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
