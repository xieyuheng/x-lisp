import { createUrl } from "@xieyuheng/helpers.js/url"
import assert from "node:assert"
import * as L from "../lisp/index.ts"
import type { Project } from "./index.ts"
import { logFile, projectForEachSource, projectGetSourceFile } from "./index.ts"

export function projectInterpret(project: Project): void {
  const dependencyGraph = L.createDependencyGraph()

  projectForEachSource(project, (project, id) =>
    interpretTest(project, id, dependencyGraph),
  )
}

function interpretTest(
  project: Project,
  id: string,
  dependencyGraph: L.DependencyGraph
): void {
  if (id.endsWith("test" + L.suffix) || id.endsWith("snapshot" + L.suffix)) {
    const inputFile = projectGetSourceFile(project, id)
    logFile("interpret", inputFile)
    const mod = L.load(createUrl(inputFile), dependencyGraph)
    const main = L.modLookupDefinition(mod, "main")
    if (main) {
      assert(main.kind === "FunctionDefinition")
      L.evaluate(mod, L.emptyEnv(), main.body)
    }
  }
}
