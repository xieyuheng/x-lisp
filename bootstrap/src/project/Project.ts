import fs from "node:fs"
import Path from "node:path"
import * as B from "../basic/index.ts"
import * as L from "../lang/index.ts"
import * as M from "../machine/index.ts"
import { type ProjectConfig } from "./ProjectConfig.ts"

export class Project {
  rootDirectory: string
  config: ProjectConfig

  constructor(rootDirectory: string, config: ProjectConfig) {
    this.rootDirectory = rootDirectory
    this.config = config
  }

  sourceDirectory(): string {
    return Path.resolve(
      this.rootDirectory,
      this.config["build"]["source-directory"],
    )
  }

  outputDirectory(): string {
    return this.config["build"]["output-directory"]
      ? Path.resolve(
          this.rootDirectory,
          this.config["build"]["output-directory"],
        )
      : this.sourceDirectory()
  }

  sourceIds(): Array<string> {
    return fs
      .readdirSync(this.sourceDirectory(), {
        encoding: "utf8",
        recursive: true,
      })
      .filter((file) => file.endsWith(L.suffix))
  }

  getSourceFile(sourceId: string): string {
    return Path.join(this.sourceDirectory(), sourceId)
  }

  getPassLogFile(sourceId: string): string {
    return Path.join(this.outputDirectory(), sourceId) + ".log"
  }

  getBasicFile(sourceId: string): string {
    return Path.join(
      this.outputDirectory(),
      sourceId.slice(0, -L.suffix.length) + B.suffix,
    )
  }

  getBasicBundleFile(sourceId: string): string {
    return Path.join(
      this.outputDirectory(),
      sourceId.slice(0, -L.suffix.length) + ".bundle" + B.suffix,
    )
  }

  getMachineFile(sourceId: string): string {
    return Path.join(
      this.outputDirectory(),
      sourceId.slice(0, -L.suffix.length) + M.suffix,
    )
  }

  forEachSource(f: (project: Project, id: string) => void) {
    for (const id of this.sourceIds()) {
      f(this, id)
    }
  }
}
