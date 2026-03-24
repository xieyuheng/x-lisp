import {
  callWithFile,
  fileWrite,
  openOutputFile,
  withOutputToFile,
} from "@xieyuheng/helpers.js/file"
import * as B from "../basic/index.ts"
import { textWidth } from "../config.ts"
import * as M from "../meta/index.ts"
import * as Passes from "../passes/index.ts"
import {
  logPath,
  projectGetSourcePath,
  projectSourceIds,
  type Project,
} from "./index.ts"

export function projectDump(
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

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, dependencyGraph)
    Passes.ShrinkPass(mod)
    dumpCode("005-shrink", M.prettyModDefinitions(textWidth, mod), path)
  }

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, dependencyGraph)
    Passes.UniquifyPass(mod)
    dumpCode("010-uniquify", M.prettyModDefinitions(textWidth, mod), path)
  }

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, dependencyGraph)
    Passes.LiftLambdaPass(mod)
    dumpCode("012-lift-lambda", M.prettyModDefinitions(textWidth, mod), path)
  }

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, dependencyGraph)
    Passes.UnnestOperandPass(mod)
    dumpCode("020-unnest-operand", M.prettyModDefinitions(textWidth, mod), path)
  }
}

function dumpCode(tag: string, code: string, path: string): void {
  const dumpPath = `${path}.${tag}.dump`
  logPath(tag, dumpPath)
  callWithFile(openOutputFile(dumpPath), (file) => {
    fileWrite(file, code)
  })
}
