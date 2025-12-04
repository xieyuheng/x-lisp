import * as M from "@xieyuheng/machine-lisp.js"
import fs from "node:fs"
import Path from "node:path"
import * as B from "../basic/index.ts"
import * as X from "../index.ts"
import type { Project } from "./index.ts"

export function projectSourceDirectory(project: Project): string {
  return Path.resolve(
    project.rootDirectory,
    project.config["build"]["source-directory"],
  )
}

export function projectOutputDirectory(project: Project): string {
  return project.config["build"]["output-directory"]
    ? Path.resolve(
        project.rootDirectory,
        project.config["build"]["output-directory"],
      )
    : projectSourceDirectory(project)
}

export function projectSourceIds(project: Project): Array<string> {
  if (project.sourceIds) {
    return project.sourceIds
  }

  return fs
    .readdirSync(projectSourceDirectory(project), {
      encoding: "utf8",
      recursive: true,
    })
    .filter((file) => file.endsWith(X.suffix))
}

export function projectGetSourceFile(
  project: Project,
  sourceId: string,
): string {
  return Path.join(projectSourceDirectory(project), sourceId)
}

export function projectGetPassLogFile(
  project: Project,
  sourceId: string,
): string {
  return Path.join(projectOutputDirectory(project), sourceId) + ".log"
}

export function projectGetBasicFile(
  project: Project,
  sourceId: string,
): string {
  return Path.join(
    projectOutputDirectory(project),
    sourceId.slice(0, -X.suffix.length) + B.suffix,
  )
}

export function projectGetBasicBundleFile(
  project: Project,
  sourceId: string,
): string {
  return Path.join(
    projectOutputDirectory(project),
    sourceId.slice(0, -X.suffix.length) + ".bundle" + B.suffix,
  )
}

export function projectGetX86MachineFile(
  project: Project,
  sourceId: string,
): string {
  return Path.join(
    projectOutputDirectory(project),
    sourceId.slice(0, -X.suffix.length) + ".x86" + M.suffix,
  )
}

export function projectForEachSource(
  project: Project,
  f: (project: Project, id: string) => void,
) {
  for (const id of projectSourceIds(project)) {
    f(project, id)
  }
}
