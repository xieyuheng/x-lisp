import {
  callWithFile,
  fileWrite,
  openOutputFile,
  withOutputToFile,
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

  L.dependencyGraphForEachMod(dependencyGraph, (mod) => {
    if (mod.path.endsWith(".type-error.lisp")) {
      callWithFile(openOutputFile(`${mod.path}.out`), (file) => {
        withOutputToFile(file, () => {
          L.modForEachOwnDefinition(mod, L.definitionCheck)
        })
      })
    } else {
      L.modForEachOwnDefinition(mod, L.definitionCheck)
    }
  })

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = L.loadMod(path, dependencyGraph)
    dumpCode("003-checked", L.prettyModDefinitions(textWidth, mod), path)
  }
}

function dumpCode(tag: string, code: string, path: string): void {
  const dumpPath = `${path}.${tag}.dump`
  logPath(tag, dumpPath)
  callWithFile(openOutputFile(dumpPath), (file) => {
    fileWrite(file, code)
  })
}
