import { createUrl } from "@xieyuheng/helpers.js/url"
import * as F from "../forth/index.ts"
import { globals } from "../globals.ts"
import * as L from "../lisp/index.ts"
import * as Services from "../services/index.ts"
import {
  logFile,
  projectForEachSource,
  projectGetForthFile,
  projectGetPassLogFile,
  projectGetSourceFile,
  writeFile,
  type Project,
} from "./index.ts"

export function projectBuild(project: Project): void {
  // projectForEachSource(project, buildPassLog)
  projectForEachSource(project, buildForth)
}

function buildPassLog(project: Project, id: string): void {
  const inputFile = projectGetSourceFile(project, id)
  const outputFile = projectGetPassLogFile(project, id)
  logFile("pass-log", outputFile)
  const mod = L.loadEntry(createUrl(inputFile))
  writeFile(outputFile, "")
  Services.compileLispToPassLog(mod, outputFile)
}

function buildForth(project: Project, id: string): void {
  const inputFile = projectGetSourceFile(project, id)
  const outputFile = projectGetForthFile(project, id)
  logFile("forth", outputFile)
  const mod = L.loadEntry(createUrl(inputFile))
  const forthMod = Services.compileLispToForth(mod)
  const outputText = F.prettyMod(forthMod, { width: 10 })
  writeFile(outputFile, outputText)
}
