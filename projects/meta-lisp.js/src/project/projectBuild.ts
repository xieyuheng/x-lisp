import { createUrl } from "@xieyuheng/helpers.js/url"
import * as L from "../lisp/index.ts"
import * as Services from "../services/index.ts"
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
    Services.compileLispToPassLog(mod, outputFile)
  }
}
