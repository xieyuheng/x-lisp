import * as B from "../basic/index.ts"
import { globals } from "../globals.ts"
import { createUrl } from "../helpers/url/createUrl.ts"
import * as L from "../lang/index.ts"
import * as M from "../machine/index.ts"
import * as Services from "../services/index.ts"
import {
  isSnapshot,
  isTest,
  logFile,
  projectForEachSource,
  projectGetBasicBundleFile,
  projectGetBasicFile,
  projectGetMachineFile,
  projectGetPassLogFile,
  projectGetSourceFile,
  writeFile,
  type Project,
} from "./index.ts"

export function projectBuild(project: Project): void {
  projectForEachSource(project, buildPassLog)
  projectForEachSource(project, buildBasic)
  projectForEachSource(project, buildBasicBundle)
  projectForEachSource(project, buildMachine)
  projectForEachSource(project, buildMachineX86assembly)
  projectForEachSource(project, buildMachineX86Binary)
}

function buildPassLog(project: Project, id: string): void {
  const inputFile = projectGetSourceFile(project, id)
  const outputFile = projectGetPassLogFile(project, id)
  logFile("pass-log", outputFile)
  const langMod = L.loadEntry(createUrl(inputFile))
  writeFile(outputFile, "")
  Services.compileLangToPassLog(langMod, outputFile)
}

function buildBasic(project: Project, id: string): void {
  const inputFile = projectGetSourceFile(project, id)
  const outputFile = projectGetBasicFile(project, id)
  logFile("basic", outputFile)
  const langMod = L.loadEntry(createUrl(inputFile))
  const basicMod = Services.compileLangToBasic(langMod)
  const outputText = B.prettyMod(globals.maxWidth, basicMod)
  writeFile(outputFile, outputText + "\n")
}

function buildBasicBundle(project: Project, id: string): void {
  if (isTest(id) || isSnapshot(id)) {
    const inputFile = projectGetBasicFile(project, id)
    const outputFile = projectGetBasicBundleFile(project, id)
    logFile("basic-bundle", outputFile)
    const basicMod = B.loadEntry(createUrl(inputFile))
    const basicBundleMod = B.bundle(basicMod)
    const outputText = B.prettyMod(globals.maxWidth, basicBundleMod)
    writeFile(outputFile, outputText + "\n")
  }
}

function buildMachine(project: Project, id: string): void {
  if (isTest(id) || isSnapshot(id)) {
    const inputFile = projectGetBasicBundleFile(project, id)
    const outputFile = projectGetMachineFile(project, id)
    logFile("machine", outputFile)
    const basicBundleMod = B.loadEntry(createUrl(inputFile))
    const machineMod = Services.compileBasicToX86Machine(basicBundleMod)
    const outputText = M.prettyMod(globals.maxWidth, machineMod)
    writeFile(outputFile, outputText + "\n")
  }
}

function buildMachineX86assembly(project: Project, id: string): void {
  if (isTest(id) || isSnapshot(id)) {
    const inputFile = projectGetMachineFile(project, id)
    const outputFile = projectGetMachineFile(project, id) + ".x86.s"
    logFile("x86-assembly", outputFile)
    const machineMod = M.loadEntry(createUrl(inputFile))
    const outputText = M.transpileToX86Assembly(machineMod)
    writeFile(outputFile, outputText)
  }
}

function buildMachineX86Binary(project: Project, id: string): void {
  if (isTest(id) || isSnapshot(id)) {
    const inputFile = projectGetMachineFile(project, id) + ".x86.s"
    const outputFile = projectGetMachineFile(project, id) + ".x86"
    logFile("x86-binary", outputFile)
    Services.assembleX86FileWithRuntime(inputFile)
  }
}
