import {
  callWithFile,
  fileWrite,
  openOutputFile,
} from "@xieyuheng/helpers.js/file"
import Path from "node:path"
import { textWidth } from "../../config.ts"
import * as M from "../index.ts"
import { pathRelativeToCwd } from "@xieyuheng/helpers.js/path"

export function projectDump(project: M.Project): void {
  M.projectPerformClaim(project)
  projectDumpMods(project, "001-load")

  M.projectPerformDesugar(project)
  projectDumpMods(project, "002-desugar")

  M.projectPerformQualify(project)
  projectDumpMods(project, "003-qualify")

  M.projectPerformCheck(project)
  projectDumpMods(project, "004-check")

  M.projectForEachMod(project, M.ShrinkPass)
  projectDumpMods(project, "005-shrink")

  M.projectForEachMod(project, M.UniquifyPass)
  projectDumpMods(project, "010-uniquify")

  M.projectForEachMod(project, M.LiftLambdaPass)
  projectDumpMods(project, "012-lift-lambda")

  M.projectForEachMod(project, M.UnnestOperandPass)
  projectDumpMods(project, "020-unnest-operand")
}

function projectDumpMods(project: M.Project, tag: string): void {
  M.projectForEachMod(project, (mod) => {
    const code = M.prettyModDefinitions(textWidth, mod)
    projectDumpCode(project, mod, tag, code)
  })
}

function projectDumpCode(
  project: M.Project,
  mod: M.Mod,
  tag: string,
  code: string,
): void {
  const directory = Path.join(M.projectOutputDirectory(project), "dumps")
  const dumpPath = `${directory}/${mod.name}.${tag}.dump`
  M.log(tag, pathRelativeToCwd(dumpPath))
  callWithFile(openOutputFile(dumpPath), (file) => {
    fileWrite(file, code)
  })
}
