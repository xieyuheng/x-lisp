import { systemShellRun } from "@xieyuheng/helpers.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as L from "../lisp/index.ts"
import type { Project } from "./index.ts"
import {
  logFile,
  projectBuild,
  projectForEachSource,
  projectGetForthFile,
} from "./index.ts"

export function projectTest(project: Project): void {
  projectBuild(project)
  projectForEachSource(project, runForthTest)
  projectForEachSource(project, runForthSnapshot)
  projectForEachSource(project, runForthErrorSnapshot)
}

const currentDir = Path.dirname(fileURLToPath(import.meta.url))
const forthInterpreterFile = Path.join(
  currentDir,
  "../../../x-lisp-forth.c/src/x-lisp-forth",
)

function runForthTest(project: Project, id: string): void {
  if (id.endsWith("test" + L.suffix)) {
    const inputFile = projectGetForthFile(project, id)
    logFile("forth-test", inputFile)
    const { status, stdout, stderr } = systemShellRun(forthInterpreterFile, [
      "run",
      inputFile,
    ])

    if (stderr !== "") process.stderr.write(stderr)
    if (stdout !== "") process.stdout.write(stdout)
    if (status !== 0) process.exit(status)
  }
}

function runForthSnapshot(project: Project, id: string): void {
  if (id.endsWith("snapshot" + L.suffix)) {
    const inputFile = projectGetForthFile(project, id)
    const outputFile = inputFile + ".out"
    logFile("forth-snapshot", outputFile)
    const { status, stdout, stderr } = systemShellRun(forthInterpreterFile, [
      "run",
      inputFile,
      ">",
      outputFile,
    ])

    if (status !== 0) {
      process.stderr.write(stderr)
      process.stdout.write(stdout)
      process.exit(status)
    }
  }
}

function runForthErrorSnapshot(project: Project, id: string): void {
  if (id.endsWith("error" + L.suffix)) {
    const inputFile = projectGetForthFile(project, id)
    const outputFile = inputFile + ".err"
    logFile("forth-error-snapshot", outputFile)
    const { status, stdout, stderr } = systemShellRun(forthInterpreterFile, [
      "run",
      inputFile,
      ">",
      outputFile,
      "||",
      "true",
    ])

    if (status !== 0) {
      process.stderr.write(stderr)
      process.stdout.write(stdout)
      process.exit(status)
    }
  }
}
