import {
  callWithFile,
  fileWrite,
  openOutputFile,
  writeln,
} from "@xieyuheng/std.js/file"
import { pathRelativeToCwd } from "@xieyuheng/std.js/path"
import Path from "node:path"
import * as M from "../meta/index.ts"
import {
  type Package,
  packageOutputDirectory,
  packageSourceDirectory,
} from "./Package.ts"

export function packageDumpFragments(pkg: Package, tag: string): void {
  for (const fragment of pkg.fragments.values()) {
    const sourceDirectory = packageSourceDirectory(pkg)
    const name = Path.relative(sourceDirectory, fragment.path)
    const textWidth = 80
    const stmtsCode = M.formatPrettyFragmentStmts(textWidth, fragment.stmts)
    const code = `${stmtsCode}`
    const directory = Path.join(
      packageOutputDirectory(pkg),
      "dump",
      "fragments",
    )
    const dumpPath = `${directory}/${name}.${tag}.dump`
    writeln(`[${tag}] ${pathRelativeToCwd(dumpPath)}`)
    callWithFile(openOutputFile(dumpPath), (file) => {
      fileWrite(file, code)
    })
  }
}
