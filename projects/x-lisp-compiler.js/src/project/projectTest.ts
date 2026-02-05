import { systemShellRun } from "@xieyuheng/helpers.js/system"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as L from "../lisp/index.ts"
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

const currentDir = Path.dirname(fileURLToPath(import.meta.url))
const BasicInterpreterFile = Path.join(
  currentDir,
  "../../../basic-lisp.c/src/basic-lisp",
)

function runBasicTest(project: Project, id: string): void {
  if (id.endsWith("test" + L.suffix)) {
    const inputFile = projectGetBasicFile(project, id)
    logFile("basic-test", inputFile)
    const { status, stdout, stderr } = systemShellRun(BasicInterpreterFile, [
      "run",
      inputFile,
    ])

    if (stderr !== "") process.stderr.write(stderr)
    if (stdout !== "") process.stdout.write(stdout)
    if (status !== 0) process.exit(status)
  }
}

function runBasicSnapshot(project: Project, id: string): void {
  if (id.endsWith("snapshot" + L.suffix)) {
    const inputFile = projectGetBasicFile(project, id)
    const outputFile = inputFile + ".out"
    logFile("basic-snapshot", outputFile)
    const { status, stdout, stderr } = systemShellRun(BasicInterpreterFile, [
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

function runBasicErrorSnapshot(project: Project, id: string): void {
  if (id.endsWith("error" + L.suffix)) {
    const inputFile = projectGetBasicFile(project, id)
    const outputFile = inputFile + ".err"
    logFile("basic-error-snapshot", outputFile)
    const { status, stdout, stderr } = systemShellRun(BasicInterpreterFile, [
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
