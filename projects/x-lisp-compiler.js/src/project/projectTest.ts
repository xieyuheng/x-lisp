import { systemShellRun } from "@xieyuheng/helpers.js/system"
import type { Project } from "./index.ts"
import {
  isSnapshot,
  isTest,
  logFile,
  projectBuild,
  projectForEachSource,
  projectGetX86MachineFile,
} from "./index.ts"

export function projectTest(project: Project): void {
  projectBuild(project)
  projectForEachSource(project, runX86Test)
  projectForEachSource(project, runX86Snapshot)
}

function runX86Test(project: Project, id: string): void {
  if (isTest(id)) {
    const inputFile = projectGetX86MachineFile(project, id) + ".exe"
    logFile("x86-test", inputFile)
    systemShellRun(inputFile, [])
  }
}

function runX86Snapshot(project: Project, id: string): void {
  if (isSnapshot(id)) {
    const inputFile = projectGetX86MachineFile(project, id) + ".exe"
    const outputFile = inputFile + ".out"
    logFile("x86-snapshot", outputFile)
    systemShellRun(inputFile, [">", outputFile])
  }
}
