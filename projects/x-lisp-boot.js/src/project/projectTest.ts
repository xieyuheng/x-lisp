import { systemShellRun } from "@xieyuheng/helpers.js/system"
import { createUrl } from "@xieyuheng/helpers.js/url"
import * as B from "../basic/index.ts"
import type { Project } from "./index.ts"
import {
  isSnapshot,
  isTest,
  logFile,
  projectBuild,
  projectForEachSource,
  projectGetBasicBundleFile,
  projectGetX86MachineFile,
  writeFile,
} from "./index.ts"

export function projectTest(project: Project): void {
  projectBuild(project)
  projectForEachSource(project, runBasicTest)
  projectForEachSource(project, runBasicSnapshot)
  projectForEachSource(project, runX86Test)
  projectForEachSource(project, runX86Snapshot)
}

function runBasicTest(project: Project, id: string): void {
  if (isTest(id)) {
    const inputFile = projectGetBasicBundleFile(project, id)
    logFile("basic-test", inputFile)
    const basicBundleMod = B.loadEntry(createUrl(inputFile))
    B.run(basicBundleMod)
    const output = B.console.consumeOutput()
    process.stdout.write(output)
  }
}

function runBasicSnapshot(project: Project, id: string): void {
  if (isSnapshot(id)) {
    const inputFile = projectGetBasicBundleFile(project, id)
    const outputFile = inputFile + ".out"
    logFile("basic-snapshot", outputFile)
    const basicBundleMod = B.loadEntry(createUrl(inputFile))
    B.run(basicBundleMod)
    const outputText = B.console.consumeOutput()
    writeFile(outputFile, outputText)
  }
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
