import {
  callWithFile,
  fileWrite,
  openOutputFile,
  writeln,
} from "@xieyuheng/helpers.js/file"
import { pathRelativeToCwd } from "@xieyuheng/helpers.js/path"
import Path from "node:path"
import * as M from "../index.ts"

export function packageDumpMods(pkg: M.Package, tag: string): void {
  for (const mod of pkg.mods.values()) {
    const textWidth = 80
    const code = M.formatPrettyModDefinitions(textWidth, mod)
    const directory = Path.join(M.packageOutputDirectory(pkg), "dump/modules")
    const dumpPath = `${directory}/${mod.name}.${tag}.dump`
    writeln(`[${tag}] ${pathRelativeToCwd(dumpPath)}`)
    callWithFile(openOutputFile(dumpPath), (file) => {
      fileWrite(file, code)
    })
  }
}
