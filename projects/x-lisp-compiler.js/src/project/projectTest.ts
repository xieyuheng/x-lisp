import { systemShellRun } from "@xieyuheng/helpers.js/system"
import * as L from "../lisp/index.ts"
import { BasicInterpreterFile } from "./BasicInterpreterFile.ts"
import type { Project } from "./index.ts"
import {
  logFile,
  projectBuild,
  projectForEachSource,
  projectGetBasicFile,
} from "./index.ts"

export function projectTest(project: Project): void {
  projectBuild(project)
  projectForEachSource(project, runBasicTest)
  projectForEachSource(project, runBasicSnapshot)
  projectForEachSource(project, runBasicErrorSnapshot)
}

function runBasicTest(project: Project, id: string): void {
  if (id.endsWith("test" + L.suffix)) {
    const inputFile = projectGetBasicFile(project, id)
    logFile("basic-test", inputFile)
    systemShellRun(BasicInterpreterFile, ["run", inputFile])
  }
}

function runBasicSnapshot(project: Project, id: string): void {
  if (id.endsWith("snapshot" + L.suffix)) {
    const inputFile = projectGetBasicFile(project, id)
    const outputFile = inputFile + ".out"
    logFile("basic-snapshot", outputFile)
    systemShellRun(BasicInterpreterFile, ["run", inputFile, ">", outputFile])
  }
}

function runBasicErrorSnapshot(project: Project, id: string): void {
  if (id.endsWith("error" + L.suffix)) {
    const inputFile = projectGetBasicFile(project, id)
    const outputFile = inputFile + ".err"
    logFile("basic-error-snapshot", outputFile)
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
