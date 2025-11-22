import fs from "node:fs"
import Path from "node:path"
import { type Project } from "./Project.ts"
import {
  logFile,
  projectOutputDirectory,
  projectSourceDirectory,
} from "./index.ts"

export function projectClean(project: Project): void {
  if (projectOutputDirectory(project) !== projectSourceDirectory(project)) {
    fs.rmSync(projectOutputDirectory(project), { recursive: true, force: true })
  } else {
    const outputSuffixes = [
      ".lisp.log",
      ".basic",
      ".machine",
      ".exe",
      ".s",
      ".out",
    ]

    fs.readdirSync(projectSourceDirectory(project), {
      encoding: "utf8",
      recursive: true,
    })
      .filter((file) => outputSuffixes.some((suffix) => file.endsWith(suffix)))
      .forEach((file) => {
        const outputFile = Path.join(projectOutputDirectory(project), file)
        logFile("clean", outputFile)
        fs.rmSync(outputFile, { force: true })
      })
  }
}
