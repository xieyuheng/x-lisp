import { systemShellRun } from "@xieyuheng/helpers.js/system"
import { createUrl } from "@xieyuheng/helpers.js/url"
import * as B from "../basic/index.ts"
import { textWidth } from "../config.ts"
import * as L from "../lisp/index.ts"
import * as Services from "../services/index.ts"
import { BasicInterpreterFile } from "./BasicInterpreterFile.ts"
import {
  logFile,
  projectForEachSource,
  projectGetBasicFile,
  projectGetPassLogFile,
  projectGetSourceFile,
  writeFile,
  type Project,
} from "./index.ts"

export function projectBuild(project: Project): void {
  projectForEachSource(project, buildPassLog)
  projectForEachSource(project, buildBasic)
  projectForEachSource(project, buildBasicAsm)
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
  const outputText = B.prettyMod(textWidth, basicMod)
  writeFile(outputFile, outputText + "\n")
}

function buildBasicAsm(project: Project, id: string): void {
  const inputFile = projectGetBasicFile(project, id)
  const outputFile = projectGetBasicFile(project, id) + ".asm"
  logFile("basic.asm", outputFile)
  systemShellRun(BasicInterpreterFile, ["bytecode", inputFile, ">", outputFile])
}
