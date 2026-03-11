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

export function projectBuild(
  project: Project,
  dependencyGraph: L.DependencyGraph,
): void {
  for (const id of projectSourceIds(project)) {
    const inputFile = projectGetSourceFile(project, id)
    const outputFile = projectGetPassLogFile(project, id)
    logFile("pass-log", outputFile)
    const mod = L.loadMod(createUrl(inputFile), dependencyGraph)
    writeFile(outputFile, "")
    compileLispToPassLog(mod, outputFile)
  }
}

function compileLispToPassLog(mod: L.Mod, logFile?: string): void {
  logCode("Input", L.prettyModStmts(textWidth, mod), logFile)

  logCode("Loaded", L.prettyModDefinitions(textWidth, mod), logFile)
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
