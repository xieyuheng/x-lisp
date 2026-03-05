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
  type ProjectIdHandler,
} from "./index.ts"

export function projectBuild(project: Project): void {
  const dependencyGraph = L.createDependencyGraph()

  projectForEachSource(project, buildPassLog(dependencyGraph))
  projectForEachSource(project, buildBasic(dependencyGraph))
  projectForEachSource(project, buildBasicAsm(dependencyGraph))
}

function buildPassLog(dependencyGraph: L.DependencyGraph): ProjectIdHandler {
  return (project, id) => {
    const inputFile = projectGetSourceFile(project, id)
    const outputFile = projectGetPassLogFile(project, id)
    logFile("pass-log", outputFile)
    const mod = L.load(createUrl(inputFile), L.createDependencyGraph())
    writeFile(outputFile, "")
    Services.compileLispToPassLog(mod, outputFile)
  }
}

function buildBasic(dependencyGraph: L.DependencyGraph): ProjectIdHandler {
  return (project, id) => {
    const inputFile = projectGetSourceFile(project, id)
    const outputFile = projectGetBasicFile(project, id)
    logFile("basic", outputFile)
    const mod = L.load(createUrl(inputFile), L.createDependencyGraph())
    const basicMod = Services.compileLispToBasic(mod)
    const outputText = B.prettyMod(textWidth, basicMod)
    writeFile(outputFile, outputText + "\n")
  }
}

function buildBasicAsm(dependencyGraph: L.DependencyGraph): ProjectIdHandler {
  return (project, id) => {
    const inputFile = projectGetBasicFile(project, id)
    const outputFile = projectGetBasicFile(project, id) + ".asm"
    logFile("basic.asm", outputFile)
    systemShellRun(BasicInterpreterFile, [
      "bytecode",
      inputFile,
      ">",
      outputFile,
    ])
  }
}
