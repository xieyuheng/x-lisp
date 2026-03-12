import {
  callWithFile,
  fileWrite,
  openOutputFile,
} from "@xieyuheng/helpers.js/file"
import { textWidth } from "../config.ts"
import * as L from "../lisp/index.ts"
import {
  logPath,
  projectGetSourcePath,
  projectSourceIds,
  type Project,
} from "./index.ts"

export function projectDump(
  project: Project,
  dependencyGraph: L.DependencyGraph,
): void {
  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = L.loadMod(path, dependencyGraph)
    dumpCode("001-loaded", L.prettyModDefinitions(textWidth, mod), path)
  }

  L.dependencyGraphForEachDefinition(dependencyGraph, L.definitionDesugar)

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = L.loadMod(path, dependencyGraph)
    dumpCode("002-desugared", L.prettyModDefinitions(textWidth, mod), path)
  }

  L.dependencyGraphForEachDefinition(dependencyGraph, L.definitionCheck)

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = L.loadMod(path, dependencyGraph)
    dumpCode("003-checked", L.prettyModDefinitions(textWidth, mod), path)
  }
}

function dumpCode(tag: string, code: string, path: string): void {
  logPath(tag, path)
  callWithFile(openOutputFile(`${path}.${tag}.dump`), (file) => {
    fileWrite(file, code)
  })
}
