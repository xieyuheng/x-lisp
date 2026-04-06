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
  projectGetBasicPath,
  projectGetSourcePath,
  projectSourceIds,
  type Project,
} from "./index.ts"

export function projectBuild(
  project: Project,
  dependencyGraph: M.DependencyGraph,
): void {
  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, dependencyGraph)
  }

  M.dependencyGraphForEachDefinition(dependencyGraph, M.definitionDesugar)

  M.dependencyGraphForEachMod(dependencyGraph, (mod) => {
    if (mod.name.endsWith(".type-error.meta")) {
      callWithFile(openOutputFile(`${mod.name}.out`), (file) => {
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
    Passes.ShrinkPass(mod)
  }

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, dependencyGraph)
    Passes.UniquifyPass(mod)
  }

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, dependencyGraph)
    Passes.LiftLambdaPass(mod)
  }

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, dependencyGraph)
    Passes.UnnestOperandPass(mod)
  }

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, dependencyGraph)
    const basicMod = B.createMod(mod.name, new Map())
    Passes.ExplicateControlPass(mod, basicMod)
    const code = B.prettyMod(textWidth, basicMod)
    const outputPath = projectGetBasicPath(project, id)
    logPath("build", id)
    callWithFile(openOutputFile(outputPath), (file) => {
      fileWrite(file, code)
    })
  }
}
