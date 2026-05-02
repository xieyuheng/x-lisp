import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/helpers.js/file"
import * as B from "../../basic/index.ts"
import { textWidth } from "../../config.ts"
import * as Stk from "../../stack/index.ts"
import * as M from "../index.ts"

export function BuildPipeline(
  project: M.Project,
  options: {
    dump: boolean
    basic: boolean
    verbose: boolean
  },
): void {
  M.ExecutePass(project)
  M.ClaimPass(project, { dump: options.dump })
  M.DesugarPass(project, { dump: options.dump })
  M.QualifyPass(project, { dump: options.dump })
  M.LocatePass(project, { dump: options.dump })
  M.CheckPass(project, { verbose: options.verbose, dump: options.dump })
  M.ShrinkPass(project, { dump: options.dump })
  M.UniquifyPass(project, { dump: options.dump })
  M.LiftLambdaPass(project, { dump: options.dump })
  M.UnnestOperandPass(project, { dump: options.dump })
  const basicMod = M.ExplicateControlPass(project)
  if (options.basic) BasicBundle(project, basicMod)
  StackBundle(project, basicMod)
}

function BasicBundle(project: M.Project, basicMod: B.Mod): void {
  const directory = M.projectOutputDirectory(project)
  callWithFile(openOutputFile(`${directory}/bundle.basic`), (file) =>
    fileWriteln(file, B.prettyMod(textWidth, basicMod)),
  )
}

function StackBundle(project: M.Project, basicMod: B.Mod): void {
  const stackMod = Stk.createMod()
  M.CodegenPass(basicMod, stackMod)

  const directory = M.projectOutputDirectory(project)
  callWithFile(openOutputFile(`${directory}/bundle.stack`), (file) => {
    for (const definition of stackMod.definitions.values()) {
      fileWriteln(file, Stk.formatDefinition(definition))
    }
  })
}
