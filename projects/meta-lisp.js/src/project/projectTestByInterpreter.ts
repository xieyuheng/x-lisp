import { errorReport } from "@xieyuheng/helpers.js/error"
import {
  callWithFile,
  fileWrite,
  openOutputFile,
  withOutputToFile,
} from "@xieyuheng/helpers.js/file"
import * as L from "../lisp/index.ts"
import {
  logPath,
  projectGetSourcePath,
  projectSourceIds,
  type Project,
} from "./index.ts"

export function projectTestByInterpreter(
  project: Project,
  dependencyGraph: L.DependencyGraph,
): void {
  for (const id of projectSourceIds(project)) {
    const file = projectGetSourcePath(project, id)
    try {
      L.loadMod(file, dependencyGraph)
    } catch (error) {
      if (id.endsWith(".error.meta")) {
        const path = projectGetSourcePath(project, id)
        const outputPath = path + ".interpreter.out"
        logPath("interpreter-error-snapshot", outputPath)
        callWithFile(openOutputFile(outputPath), (file) => {
          fileWrite(file, errorReport(error))
        })
      } else {
        throw error
      }
    }
  }

  L.dependencyGraphForEachDefinition(dependencyGraph, L.definitionDesugar)

  for (const id of projectSourceIds(project)) {
    if (id.endsWith(".test.meta")) {
      const path = projectGetSourcePath(project, id)
      const mod = L.loadMod(path, dependencyGraph)
      logPath("interpreter-test", path)
      L.modEvaluateMainIfExists(mod)
    }
  }

  for (const id of projectSourceIds(project)) {
    if (id.endsWith(".snapshot.meta")) {
      const path = projectGetSourcePath(project, id)
      const mod = L.loadMod(path, dependencyGraph)
      const outputPath = path + ".interpreter.out"
      logPath("interpreter-snapshot", outputPath)
      callWithFile(openOutputFile(outputPath), (file) => {
        withOutputToFile(file, () => L.modEvaluateMainIfExists(mod))
      })
    }
  }

  for (const id of projectSourceIds(project)) {
    if (id.endsWith(".error.meta")) {
      const path = projectGetSourcePath(project, id)
      const mod = L.loadMod(path, dependencyGraph)
      const outputPath = path + ".interpreter.out"
      logPath("interpreter-error-snapshot", outputPath)
      callWithFile(openOutputFile(outputPath), (file) => {
        try {
          withOutputToFile(file, () => L.modEvaluateMainIfExists(mod))
          throw new Error("[interpreter-error-snapshot] expecting error")
        } catch (error) {
          fileWrite(file, errorReport(error))
        }
      })
    }
  }
}
