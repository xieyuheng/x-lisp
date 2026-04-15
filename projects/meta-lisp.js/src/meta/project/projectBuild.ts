import {
  callWithFile,
  fileWrite,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/helpers.js/file"
import { pathRelativeToCwd } from "@xieyuheng/helpers.js/path"
import Path from "node:path"
import * as B from "../../basic/index.ts"
import { textWidth } from "../../config.ts"
import * as M from "../index.ts"

export function projectBuild(
  project: M.Project,
  options: { dump: boolean },
): void {
  M.projectPerformClaim(project)
  if (options.dump) projectDumpMods(project, "001-load")
  M.projectPerformDesugar(project)
  if (options.dump) projectDumpMods(project, "002-desugar")
  M.projectPerformQualify(project)
  if (options.dump) projectDumpMods(project, "003-qualify")
  M.projectPerformCheck(project)
  if (options.dump) projectDumpMods(project, "004-check")
  M.projectForEachMod(project, M.ShrinkPass)
  if (options.dump) projectDumpMods(project, "005-shrink")
  M.projectForEachMod(project, M.UniquifyPass)
  if (options.dump) projectDumpMods(project, "010-uniquify")
  M.projectForEachMod(project, M.LiftLambdaPass)
  if (options.dump) projectDumpMods(project, "012-lift-lambda")
  M.projectForEachMod(project, M.UnnestOperandPass)
  if (options.dump) projectDumpMods(project, "020-unnest-operand")
  projectBundle(project)
}

function projectBundle(project: M.Project): void {
  let code = ""

  M.projectForEachMod(project, (mod) => {
    if (!mod.isTypeErrorModule) {
      M.log("bundle", mod.name)
      const basicMod = B.createMod(mod.name, new Map())
      M.ExplicateControlPass(mod, basicMod)
      code += B.prettyMod(textWidth, basicMod)
      code += "\n\n"
    }
  })

  code = code.trim()

  const directory = M.projectOutputDirectory(project)
  callWithFile(openOutputFile(`${directory}/bundle.basic`), (file) =>
    fileWriteln(file, code),
  )
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
