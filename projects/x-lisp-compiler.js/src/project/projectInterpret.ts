import { createUrl } from "@xieyuheng/helpers.js/url"
import * as L from "../lisp/index.ts"
import type { Project } from "./index.ts"
import { logFile, projectBuild, projectForEachSource, projectGetSourceFile } from "./index.ts"
import assert from "node:assert"

export function projectInterpret(project: Project): void {
  projectBuild(project)
  projectForEachSource(project, interpretTest)
}

function interpretTest(project: Project, id: string): void {
  const inputFile = projectGetSourceFile(project, id)
  logFile("interpret", inputFile)
  const mod = L.loadEntry(createUrl(inputFile))
  const main = L.modLookupDefinition(mod, "main")
  if (main) {
    assert(main.kind === "FunctionDefinition")
    L.evaluate(mod, L.emptyEnv(), main.body)
  }
}
