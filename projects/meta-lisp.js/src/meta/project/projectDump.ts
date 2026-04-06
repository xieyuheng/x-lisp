import {
  callWithFile,
  fileWrite,
  openOutputFile,
  withOutputToFile,
} from "@xieyuheng/helpers.js/file"
import Path from "node:path"
import { textWidth } from "../../config.ts"
import * as M from "../index.ts"
import * as Passes from "../passes/index.ts"
import {
  logPath,
  projectGetSourcePath,
  projectOutputDirectory,
  projectSourceIds,
  type Project,
} from "./index.ts"

export function projectDump(project: Project): void {
  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, project)
    projectDumpCode(
      project,
      id,
      "001-loaded",
      M.prettyModDefinitions(textWidth, mod),
    )
  }

  M.projectForEachDefinition(project, M.definitionDesugar)

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, project)
    projectDumpCode(
      project,
      id,
      "002-desugared",
      M.prettyModDefinitions(textWidth, mod),
    )
  }

  M.projectForEachMod(project, (mod) => {
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
    const mod = M.loadMod(path, project)
    projectDumpCode(
      project,
      id,
      "003-checked",
      M.prettyModDefinitions(textWidth, mod),
    )
  }

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, project)
    Passes.ShrinkPass(mod)
    projectDumpCode(
      project,
      id,
      "005-shrink",
      M.prettyModDefinitions(textWidth, mod),
    )
  }

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, project)
    Passes.UniquifyPass(mod)
    projectDumpCode(
      project,
      id,
      "010-uniquify",
      M.prettyModDefinitions(textWidth, mod),
    )
  }

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, project)
    Passes.LiftLambdaPass(mod)
    projectDumpCode(
      project,
      id,
      "012-lift-lambda",
      M.prettyModDefinitions(textWidth, mod),
    )
  }

  for (const id of projectSourceIds(project)) {
    const path = projectGetSourcePath(project, id)
    const mod = M.loadMod(path, project)
    Passes.UnnestOperandPass(mod)
    projectDumpCode(
      project,
      id,
      "020-unnest-operand",
      M.prettyModDefinitions(textWidth, mod),
    )
  }
}

function projectDumpCode(
  project: Project,
  id: string,
  tag: string,
  code: string,
): void {
  const path = Path.join(projectOutputDirectory(project), id)
  const dumpPath = `${path}.${tag}.dump`
  logPath(tag, dumpPath)
  callWithFile(openOutputFile(dumpPath), (file) => {
    fileWrite(file, code)
  })
}
