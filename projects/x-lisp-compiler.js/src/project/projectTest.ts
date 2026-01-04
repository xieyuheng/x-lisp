import { systemShellRun } from "@xieyuheng/helpers.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import type { Project } from "./index.ts"
import {
  isSnapshot,
  isTest,
  logFile,
  projectBuild,
  projectForEachSource,
  projectGetForthFile,
} from "./index.ts"

export function projectTest(project: Project): void {
  projectBuild(project)
  projectForEachSource(project, runForthTest)
  projectForEachSource(project, runForthSnapshot)
}

const currentDir = Path.dirname(fileURLToPath(import.meta.url))
const forthInterpreterFile = Path.join(
  currentDir,
  "../../../x-lisp-forth.c/src/x-lisp-forth",
)

function runForthTest(project: Project, id: string): void {
  if (isTest(id)) {
    const inputFile = projectGetForthFile(project, id)
    logFile("forth-test", inputFile)
    systemShellRun(forthInterpreterFile, ["run", inputFile])
  }
}

function runForthSnapshot(project: Project, id: string): void {
  if (isSnapshot(id)) {
    const inputFile = projectGetForthFile(project, id)
    const outputFile = inputFile + ".out"
    logFile("forth-snapshot", outputFile)
    systemShellRun(forthInterpreterFile, ["run", inputFile, ">", outputFile])
  }
}
