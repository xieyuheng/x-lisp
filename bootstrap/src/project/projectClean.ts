import fs from "node:fs"
import Path from "node:path"
import { Project } from "./Project.ts"
import { logFile } from "./index.ts"

export function projectClean(project: Project): void {
  if (project.outputDirectory() !== project.sourceDirectory()) {
    fs.rmSync(project.outputDirectory(), { recursive: true, force: true })
  } else {
    const outputSuffixes = [
      ".lisp.log",
      ".basic",
      ".machine",
      ".machine.x86",
      ".machine.x86.s",
      ".out",
    ]

    fs.readdirSync(project.sourceDirectory(), {
      encoding: "utf8",
      recursive: true,
    })
      .filter((file) => outputSuffixes.some((suffix) => file.endsWith(suffix)))
      .forEach((file) => {
        const outputFile = Path.join(project.outputDirectory(), file)
        logFile("clean", outputFile)
        fs.rmSync(outputFile, { force: true })
      })
  }
}
