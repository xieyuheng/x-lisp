import { createUrl } from "@xieyuheng/helpers.js/url"
import * as L from "../lisp/index.ts"
import * as Services from "../services/index.ts"
import {
  logFile,
  projectForEachSource,
  projectGetPassLogFile,
  projectGetSourceFile,
  writeFile,
  type Project,
  type ProjectIdHandler,
} from "./index.ts"

export function projectBuild(
  project: Project,
  dependencyGraph: L.DependencyGraph,
): void {
  projectForEachSource(project, buildPassLog(dependencyGraph))
}

function buildPassLog(dependencyGraph: L.DependencyGraph): ProjectIdHandler {
  return (project, id) => {
    const inputFile = projectGetSourceFile(project, id)
    const outputFile = projectGetPassLogFile(project, id)
    logFile("pass-log", outputFile)
    const mod = L.load(createUrl(inputFile), dependencyGraph)
    writeFile(outputFile, "")
    Services.compileLispToPassLog(mod, outputFile)
  }
}
