import {
  callWithFile,
  fileWrite,
  openOutputFile,
  writeln,
} from "@xieyuheng/std.js/file"
import { pathRelativeToCwd } from "@xieyuheng/std.js/path"
import Path from "node:path"
import * as M from "../meta/index.ts"
import { type Package, packageOutputDirectory } from "./Package.ts"

export function packageDumpMods(pkg: Package, tag: string): void {
  for (const mod of pkg.mods.values()) {
    const textWidth = 80
    const code = M.formatPrettyModDefinitions(textWidth, mod)
    const directory = Path.join(packageOutputDirectory(pkg), "dump/modules")
    const dumpPath = `${directory}/${mod.name}.${tag}.dump`
    writeln(`[${tag}] ${pathRelativeToCwd(dumpPath)}`)
    callWithFile(openOutputFile(dumpPath), (file) => {
      fileWrite(file, code)
    })
  }
}
