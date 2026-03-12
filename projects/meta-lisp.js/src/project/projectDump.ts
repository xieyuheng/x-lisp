import {
  callWithFile,
  fileOpenForWrite,
  fileWrite,
} from "@xieyuheng/helpers.js/file"
import { createUrl } from "@xieyuheng/helpers.js/url"
import { textWidth } from "../config.ts"
import * as L from "../lisp/index.ts"
import {
  logFile,
  projectGetSourceFile,
  projectSourceIds,
  type Project,
} from "./index.ts"

export function projectDump(
  project: Project,
  dependencyGraph: L.DependencyGraph,
): void {
  for (const id of projectSourceIds(project)) {
    const file = projectGetSourceFile(project, id)
    const mod = L.loadMod(createUrl(file), dependencyGraph)
    dumpCode("001-loaded", L.prettyModDefinitions(textWidth, mod), file)
  }

  L.dependencyGraphForEachDefinition(dependencyGraph, L.definitionDesugar)

  for (const id of projectSourceIds(project)) {
    const file = projectGetSourceFile(project, id)
    const mod = L.loadMod(createUrl(file), dependencyGraph)
    dumpCode("002-desugared", L.prettyModDefinitions(textWidth, mod), file)
  }

  L.dependencyGraphForEachDefinition(dependencyGraph, L.definitionCheck)

  for (const id of projectSourceIds(project)) {
    const file = projectGetSourceFile(project, id)
    const mod = L.loadMod(createUrl(file), dependencyGraph)
    dumpCode("003-checked", L.prettyModDefinitions(textWidth, mod), file)
  }
}

function dumpCode(tag: string, code: string, file: string): void {
  logFile(tag, file)
  callWithFile(fileOpenForWrite(`${file}.${tag}.dump`), (file) => {
    fileWrite(file, code)
  })
}
