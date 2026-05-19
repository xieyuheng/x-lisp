import {
  callWithFile,
  fileWrite,
  openOutputFile,
} from "@xieyuheng/helpers.js/file"
import { pathRelativeToCwd } from "@xieyuheng/helpers.js/path"
import Path from "node:path"
import { textWidth } from "../../config.ts"
import * as M from "../index.ts"

export function projectDumpFragments(project: M.Project, tag: string): void {
  const sourceDirectory = M.projectSourceDirectory(project)

  for (const fragment of project.fragments.values()) {
    const name = Path.relative(sourceDirectory, fragment.path)
    const stmtsCode = M.prettyFragmentStmts(textWidth, fragment.stmts)
    const code = `${stmtsCode}`
    const directory = Path.join(
      M.projectOutputDirectory(project),
      "dump",
      "fragments",
    )
    const dumpPath = `${directory}/${name}.${tag}.dump`
    M.log(tag, pathRelativeToCwd(dumpPath))
    callWithFile(openOutputFile(dumpPath), (file) => {
      fileWrite(file, code)
    })
  }
}
