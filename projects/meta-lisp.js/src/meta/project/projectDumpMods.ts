import {
  callWithFile,
  fileWrite,
  openOutputFile,
  writeln,
} from "@xieyuheng/helpers.js/file"
import { pathRelativeToCwd } from "@xieyuheng/helpers.js/path"
import Path from "node:path"
import { textWidth } from "../../config.ts"
import * as M from "../index.ts"

export function projectDumpMods(project: M.Project, tag: string): void {
  for (const mod of project.mods.values()) {
    const code = M.prettyModDefinitions(textWidth, mod)
    projectDumpCode(project, mod, tag, code)
  }
}

function projectDumpCode(
  project: M.Project,
  mod: M.Mod,
  tag: string,
  code: string,
): void {
  const directory = Path.join(
    M.projectOutputDirectory(project),
    "dump",
    "modules",
  )
  const dumpPath = `${directory}/${mod.name}.${tag}.dump`
  writeln(`[${tag}] ${pathRelativeToCwd(dumpPath)}`)
  callWithFile(openOutputFile(dumpPath), (file) => {
    fileWrite(file, code)
  })
}
