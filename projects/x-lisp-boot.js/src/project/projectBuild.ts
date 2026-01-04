import { createUrl } from "@xieyuheng/helpers.js/url"
import * as B from "../basic/index.ts"
import { globals } from "../globals.ts"
import * as L from "../index.ts"
import * as M from "../machine/index.ts"
import * as Passes from "../passes/index.ts"
import * as Services from "../services/index.ts"
import {
  isSnapshot,
  isTest,
  logFile,
  projectForEachSource,
  projectGetBasicBundleFile,
  projectGetBasicFile,
  projectGetPassLogFile,
  projectGetSourceFile,
  projectGetX86MachineFile,
  writeFile,
  type Project,
} from "./index.ts"

export function projectBuild(project: Project): void {
  projectForEachSource(project, buildPassLog)
  projectForEachSource(project, buildBasic)
  projectForEachSource(project, buildBasicBundle)
  projectForEachSource(project, buildX86Machine)
  projectForEachSource(project, buildX86Machineassembly)
  projectForEachSource(project, buildX86MachineBinary)
}

function buildPassLog(project: Project, id: string): void {
  const inputFile = projectGetSourceFile(project, id)
  const outputFile = projectGetPassLogFile(project, id)
  logFile("pass-log", outputFile)
  const mod = L.loadEntry(createUrl(inputFile))
  writeFile(outputFile, "")
  Services.compileLispToPassLog(mod, outputFile)
}

function buildBasic(project: Project, id: string): void {
  const inputFile = projectGetSourceFile(project, id)
  const outputFile = projectGetBasicFile(project, id)
  logFile("basic", outputFile)
  const mod = L.loadEntry(createUrl(inputFile))
  const basicMod = Services.compileLispToBasic(mod)
  const outputText = B.prettyMod(globals.width, basicMod)
  writeFile(outputFile, outputText + "\n")
}

function buildBasicBundle(project: Project, id: string): void {
  if (isTest(id) || isSnapshot(id)) {
    const inputFile = projectGetBasicFile(project, id)
    const outputFile = projectGetBasicBundleFile(project, id)
    logFile("basic-bundle", outputFile)
    const basicMod = B.loadEntry(createUrl(inputFile))
    const basicBundleMod = B.bundle(basicMod)
    Passes.SetupPrimitiveFunction(basicBundleMod)
    Passes.SetupFunctionTablePass(basicBundleMod)
    const outputText = B.prettyMod(globals.width, basicBundleMod)
    writeFile(outputFile, outputText + "\n")
  }
}

function buildX86Machine(project: Project, id: string): void {
  if (isTest(id) || isSnapshot(id)) {
    const inputFile = projectGetBasicBundleFile(project, id)
    const outputFile = projectGetX86MachineFile(project, id)
    logFile("machine", outputFile)
    const basicBundleMod = B.loadEntry(createUrl(inputFile))
    const machineMod = Services.compileBasicToX86Machine(basicBundleMod)
    const outputText = M.prettyMod(globals.width, machineMod)
    writeFile(outputFile, outputText + "\n")
  }
}

function buildX86Machineassembly(project: Project, id: string): void {
  if (isTest(id) || isSnapshot(id)) {
    const inputFile = projectGetX86MachineFile(project, id)
    const outputFile = projectGetX86MachineFile(project, id) + ".s"
    logFile("x86-assembly", outputFile)
    const machineMod = M.loadEntry(createUrl(inputFile))
    const outputText = M.transpileToX86Assembly(machineMod)
    writeFile(outputFile, outputText)
  }
}

function buildX86MachineBinary(project: Project, id: string): void {
  if (isTest(id) || isSnapshot(id)) {
    const inputFile = projectGetX86MachineFile(project, id) + ".s"
    const outputFile = projectGetX86MachineFile(project, id) + ".exe"
    logFile("x86-binary", outputFile)
    Services.assembleX86FileWithRuntime(inputFile, outputFile)
  }
}
