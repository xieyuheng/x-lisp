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
  writeFile,
  type Project,
} from "./index.ts"

export function projectBuild(project: Project): void {
  project.forEachSource(buildPassLog)
  project.forEachSource(buildBasic)
  project.forEachSource(buildBasicBundle)
  project.forEachSource(buildMachine)
  project.forEachSource(buildMachineX86assembly)
  project.forEachSource(buildMachineX86Binary)
}

function buildPassLog(project: Project, id: string): void {
  const inputFile = project.getSourceFile(id)
  const outputFile = project.getPassLogFile(id)
  logFile("pass-log", outputFile)
  const langMod = L.loadEntry(createUrl(inputFile))
  writeFile(outputFile, "")
  Services.compileLangToPassLog(langMod, outputFile)
}

function buildBasic(project: Project, id: string): void {
  const inputFile = project.getSourceFile(id)
  const outputFile = project.getBasicFile(id)
  logFile("basic", outputFile)
  const langMod = L.loadEntry(createUrl(inputFile))
  const basicMod = Services.compileLangToBasic(langMod)
  const outputText = B.prettyMod(globals.maxWidth, basicMod)
  writeFile(outputFile, outputText)
}

function buildBasicBundle(project: Project, id: string): void {
  if (isTest(id) || isSnapshot(id)) {
    const inputFile = project.getBasicFile(id)
    const outputFile = project.getBasicBundleFile(id)
    logFile("basic-bundle", outputFile)
    const basicMod = B.loadEntry(createUrl(inputFile))
    const basicBundleMod = B.bundle(basicMod)
    const outputText = B.prettyMod(globals.maxWidth, basicBundleMod)
    writeFile(outputFile, outputText)
  }
}

function buildMachine(project: Project, id: string): void {
  if (isTest(id) || isSnapshot(id)) {
    const inputFile = project.getBasicBundleFile(id)
    const outputFile = project.getMachineFile(id)
    logFile("machine", outputFile)
    const basicBundleMod = B.loadEntry(createUrl(inputFile))
    const machineMod = Services.compileBasicToX86Machine(basicBundleMod)
    const outputText = M.prettyMod(globals.maxWidth, machineMod)
    writeFile(outputFile, outputText)
  }
}

function buildMachineX86assembly(project: Project, id: string): void {
  if (isTest(id) || isSnapshot(id)) {
    const inputFile = project.getMachineFile(id)
    const outputFile = project.getMachineFile(id) + ".x86.s"
    logFile("x86-assembly", outputFile)
    const machineMod = M.loadEntry(createUrl(inputFile))
    const outputText = M.transpileToX86Assembly(machineMod)
    writeFile(outputFile, outputText)
  }
}

function buildMachineX86Binary(project: Project, id: string): void {
  if (isTest(id) || isSnapshot(id)) {
    const inputFile = project.getMachineFile(id) + ".x86.s"
    const outputFile = project.getMachineFile(id) + ".x86"
    logFile("x86-binary", outputFile)
    Services.assembleX86FileWithRuntime(inputFile)
  }
}
