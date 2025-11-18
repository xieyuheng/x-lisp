import * as B from "../basic/index.ts"
import { systemShellRun } from "../helpers/system/systemShellRun.ts"
import { createUrl } from "../helpers/url/createUrl.ts"
import type { Project } from "./index.ts"
import { projectBuild } from "./index.ts"

export function projectTest(project: Project): void {
  projectBuild(project)
  project.forEachSource(runBasicTest)
  project.forEachSource(runBasicSnapshot)
  project.forEachSource(runX86Test)
  project.forEachSource(runX86Snapshot)
}

function runBasicTest(project: Project, id: string): void {
  if (project.isTest(id)) {
    const inputFile = project.getBasicBundleFile(id)
    project.logFile("basic-test", inputFile)
    const basicBundleMod = B.loadEntry(createUrl(inputFile))
    B.run(basicBundleMod)
    const output = B.console.consumeOutput()
    process.stdout.write(output)
  }
}

function runBasicSnapshot(project: Project, id: string): void {
  if (project.isSnapshot(id)) {
    const inputFile = project.getBasicBundleFile(id)
    const outputFile = inputFile + ".out"
    project.logFile("basic-snapshot", outputFile)
    const basicBundleMod = B.loadEntry(createUrl(inputFile))
    B.run(basicBundleMod)
    const outputText = B.console.consumeOutput()
    project.writeFile(outputFile, outputText)
  }
}

function runX86Test(project: Project, id: string): void {
  if (project.isTest(id)) {
    const inputFile = project.getMachineFile(id) + ".x86"
    project.logFile("x86-test", inputFile)
    systemShellRun(inputFile, [])
  }
}

function runX86Snapshot(project: Project, id: string): void {
  if (project.isSnapshot(id)) {
    const inputFile = project.getMachineFile(id) + ".x86"
    const outputFile = inputFile + ".out"
    project.logFile("x86-snapshot", outputFile)
    systemShellRun(inputFile, [">", outputFile])
  }
}
