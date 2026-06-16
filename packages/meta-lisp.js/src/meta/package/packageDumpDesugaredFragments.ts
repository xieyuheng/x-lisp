import {
  callWithFile,
  fileWrite,
  openOutputFile,
  writeln,
} from "@xieyuheng/std.js/file"
import { pathRelativeToCwd } from "@xieyuheng/std.js/path"
import Path from "node:path"
import * as M from "../index.ts"

export function packageDumpDesugaredFragments(
  pkg: M.Package,
  tag: string,
): void {
  for (const fragment of pkg.fragments.values()) {
    const sourceDirectory = M.packageSourceDirectory(pkg)
    const name = Path.relative(sourceDirectory, fragment.path)
    const textWidth = 80
    const stmtsCode = M.formatPrettyFragmentDesugaredStmts(
      textWidth,
      fragment.desugaredStmts,
    )
    const code = `${stmtsCode}`
    const directory = Path.join(
      M.packageOutputDirectory(pkg),
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
