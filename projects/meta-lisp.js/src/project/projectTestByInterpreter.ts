import { errorReport } from "@xieyuheng/helpers.js/error"
import { createUrl } from "@xieyuheng/helpers.js/url"
import * as L from "../lisp/index.ts"
import {
  logFile,
  projectGetSourceFile,
  projectSourceIds,
  type Project,
} from "./index.ts"

export function projectTestByInterpreter(
  project: Project,
  dependencyGraph: L.DependencyGraph,
): void {
  for (const id of projectSourceIds(project)) {
    const file = projectGetSourceFile(project, id)
    L.loadMod(createUrl(file), dependencyGraph)
  }

  L.dependencyGraphForEachDefinition(dependencyGraph, L.definitionDesugar)

  for (const id of projectSourceIds(project)) {
    if (id.endsWith(".test" + L.suffix)) {
      const file = projectGetSourceFile(project, id)
      const mod = L.loadMod(createUrl(file), dependencyGraph)
      logFile("interpreter-test", file)
      L.modEvaluateMainIfExists(mod)
    }

    if (id.endsWith(".snapshot" + L.suffix)) {
      const file = projectGetSourceFile(project, id)
      const mod = L.loadMod(createUrl(file), dependencyGraph)
      const outputFile = file + ".out"
      logFile("interpreter-snapshot", outputFile)
      L.modEvaluateMainIfExists(mod)
    }

    if (id.endsWith(".error" + L.suffix)) {
      const file = projectGetSourceFile(project, id)
      const mod = L.loadMod(createUrl(file), dependencyGraph)
      const outputFile = file + ".err"
      logFile("interpreter-error-snapshot", outputFile)
      try {
        L.modEvaluateMainIfExists(mod)
        throw new Error("[interpreter-error-snapshot] expecting error")
      } catch (error) {
        console.log(errorReport(error))
      }
    }
  }
}
