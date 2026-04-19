import fs from "node:fs"
import Path from "node:path"
import * as M from "../index.ts"

export function projectClean(project: M.Project): void {
  if (M.projectOutputDirectory(project) !== M.projectSourceDirectory(project)) {
    fs.rmSync(M.projectOutputDirectory(project), {
      recursive: true,
      force: true,
    })
  } else {
    const outputSuffixes = [".dump", ".basic", ".out", ".asm"]

    fs.readdirSync(M.projectSourceDirectory(project), {
      encoding: "utf8",
      recursive: true,
    })
      .filter((file) => outputSuffixes.some((suffix) => file.endsWith(suffix)))
      .forEach((file) => {
        const outputFile = Path.join(M.projectOutputDirectory(project), file)
        M.log("clean", outputFile)
        fs.rmSync(outputFile, { force: true })
      })
  }
}
