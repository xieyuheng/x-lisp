import { createUrl } from "@xieyuheng/helpers.js/url"
import fs from "node:fs"
import { textWidth } from "../config.ts"
import * as L from "../lisp/index.ts"
import {
  logFile,
  projectGetDumpFile,
  projectGetSourceFile,
  projectSourceIds,
  writeFile,
  type Project,
} from "./index.ts"

export function projectDump(
  project: Project,
  dependencyGraph: L.DependencyGraph,
): void {
  for (const id of projectSourceIds(project)) {
    const inputFile = projectGetSourceFile(project, id)
    const outputFile = projectGetDumpFile(project, id)
    L.loadMod(createUrl(inputFile), dependencyGraph)
    writeFile(outputFile, "")
  }

  for (const id of projectSourceIds(project)) {
    const inputFile = projectGetSourceFile(project, id)
    const outputFile = projectGetDumpFile(project, id)
    const mod = L.loadMod(createUrl(inputFile), dependencyGraph)
    logCode("input", L.prettyModStmts(textWidth, mod), outputFile)
    logFile("dump-loaded", outputFile)
    logCode("loaded", L.prettyModDefinitions(textWidth, mod), outputFile)
  }

  L.dependencyGraphForEachDefinition(dependencyGraph, L.definitionDesugar)

  for (const id of projectSourceIds(project)) {
    const inputFile = projectGetSourceFile(project, id)
    const outputFile = projectGetDumpFile(project, id)
    const mod = L.loadMod(createUrl(inputFile), dependencyGraph)
    logFile("dump-desugared", outputFile)
    logCode("desugared", L.prettyModDefinitions(textWidth, mod), outputFile)
  }

  L.dependencyGraphForEachDefinition(dependencyGraph, L.definitionCheck)

  for (const id of projectSourceIds(project)) {
    const inputFile = projectGetSourceFile(project, id)
    const outputFile = projectGetDumpFile(project, id)
    const mod = L.loadMod(createUrl(inputFile), dependencyGraph)
    logFile("dump-checked", outputFile)
    logCode("checked", L.prettyModDefinitions(textWidth, mod), outputFile)
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
