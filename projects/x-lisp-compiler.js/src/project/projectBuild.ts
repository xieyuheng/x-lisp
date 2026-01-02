import { createUrl } from "@xieyuheng/helpers.js/url"
import * as L from "../index.ts"
import * as Services from "../services/index.ts"
import {
  logFile,
  projectForEachSource,
  projectGetPassLogFile,
  projectGetSourceFile,
  writeFile,
  type Project,
} from "./index.ts"

export function projectBuild(project: Project): void {
  projectForEachSource(project, buildPassLog)
}

function buildPassLog(project: Project, id: string): void {
  const inputFile = projectGetSourceFile(project, id)
  const outputFile = projectGetPassLogFile(project, id)
  logFile("pass-log", outputFile)
  const mod = L.loadEntry(createUrl(inputFile))
  writeFile(outputFile, "")
  Services.compileLispToPassLog(mod, outputFile)
}
