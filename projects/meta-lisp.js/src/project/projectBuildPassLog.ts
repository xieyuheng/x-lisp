import { createUrl } from "@xieyuheng/helpers.js/url"
import fs from "node:fs"
import { textWidth } from "../config.ts"
import * as L from "../lisp/index.ts"
import {
  logFile,
  projectGetPassLogFile,
  projectGetSourceFile,
  projectSourceIds,
  writeFile,
  type Project,
} from "./index.ts"

export function projectBuildPassLog(
  project: Project,
  dependencyGraph: L.DependencyGraph,
): void {
  for (const id of projectSourceIds(project)) {
    const inputFile = projectGetSourceFile(project, id)
    const outputFile = projectGetPassLogFile(project, id)
    logFile("pass-log", outputFile)
    const mod = L.loadMod(createUrl(inputFile), dependencyGraph)
    writeFile(outputFile, "")
  }

  for (const id of projectSourceIds(project)) {
    const inputFile = projectGetSourceFile(project, id)
    const outputFile = projectGetPassLogFile(project, id)
    const mod = L.loadMod(createUrl(inputFile), dependencyGraph)
    logCode("Input", L.prettyModStmts(textWidth, mod), outputFile)
    logCode("Loaded", L.prettyModDefinitions(textWidth, mod), outputFile)
  }

  L.dependencyGraphForEachDefinition(dependencyGraph, L.definitionDesugar)

  for (const id of projectSourceIds(project)) {
    const inputFile = projectGetSourceFile(project, id)
    const outputFile = projectGetPassLogFile(project, id)
    const mod = L.loadMod(createUrl(inputFile), dependencyGraph)
    logCode("Desugared", L.prettyModDefinitions(textWidth, mod), outputFile)
  }

  L.dependencyGraphForEachDefinition(dependencyGraph, L.definitionCheck)

  for (const id of projectSourceIds(project)) {
    const inputFile = projectGetSourceFile(project, id)
    const outputFile = projectGetPassLogFile(project, id)
    const mod = L.loadMod(createUrl(inputFile), dependencyGraph)
    logCode("Checked", L.prettyModDefinitions(textWidth, mod), outputFile)
  }
}

function logCode(tag: string, code: string, logFile?: string): void {
  log(`;;; ${tag}\n`, logFile)
  log("\n", logFile)
  log(code, logFile)
  log("\n", logFile)
  log("\n", logFile)
}

function log(text: string, logFile?: string): void {
  if (logFile === undefined) {
    process.stdout.write(text)
  } else {
    fs.appendFileSync(logFile, text)
  }
}
