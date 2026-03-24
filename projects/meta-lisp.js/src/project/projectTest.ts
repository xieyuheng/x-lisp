import {
  callWithFile,
  fileWrite,
  openOutputFile,
  withOutputToFile,
} from "@xieyuheng/helpers.js/file"
import { textWidth } from "../config.ts"
import * as M from "../meta/index.ts"
import {
  logPath,
  projectGetSourcePath,
  projectSourceIds,
  type Project,
} from "./index.ts"

export function projectTest(
  project: Project,
  dependencyGraph: M.DependencyGraph,
): void {
  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, dependencyGraph)
    dumpCode("001-loaded", M.prettyModDefinitions(textWidth, mod), path)
  }

  M.dependencyGraphForEachDefinition(dependencyGraph, M.definitionDesugar)

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, dependencyGraph)
    dumpCode("002-desugared", M.prettyModDefinitions(textWidth, mod), path)
  }

  M.dependencyGraphForEachMod(dependencyGraph, (mod) => {
    if (mod.path.endsWith(".type-error.meta")) {
      callWithFile(openOutputFile(`${mod.path}.out`), (file) => {
        withOutputToFile(file, () => {
          M.modForEachOwnDefinition(mod, M.definitionCheck)
        })
      })
    } else {
      M.modForEachOwnDefinition(mod, M.definitionCheck)
    }
  })

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, dependencyGraph)
    dumpCode("003-checked", M.prettyModDefinitions(textWidth, mod), path)
  }
}

function dumpCode(tag: string, code: string, path: string): void {
  const dumpPath = `${path}.${tag}.dump`
  logPath(tag, dumpPath)
  callWithFile(openOutputFile(dumpPath), (file) => {
    fileWrite(file, code)
  })
}
