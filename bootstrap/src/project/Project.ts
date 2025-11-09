import fs from "node:fs"
import Path from "path"
import * as B from "../basic/index.ts"
import { compileToBasic, compileToPassLog } from "../compile/index.ts"
import { globals } from "../globals.ts"
import { createUrlOrFileUrl } from "../helpers/url/createUrlOrFileUrl.ts"
import * as L from "../lang/index.ts"
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
    return Path.resolve(
      this.rootDirectory,
      this.config["build"]["output-directory"],
    )
  }

  sourceIds(): Array<string> {
    return fs
      .readdirSync(this.sourceDirectory(), {
        encoding: "utf8",
        recursive: true,
      })
      .filter(
        (file) => !file.startsWith(this.config["build"]["output-directory"]),
      )
      .filter((file) => file.endsWith(".lisp"))
  }

  async clean(): Promise<void> {
    fs.rmSync(this.outputDirectory(), { recursive: true, force: true })
  }

  async test(): Promise<void> {
    await this.build()
    // TODO
  }

  async build(): Promise<void> {
    await this.buildPassLog()
    await this.buildBasic()
  }

  async buildBasic(): Promise<void> {
    const prefix = "basic"
    for (const sourceId of this.sourceIds()) {
      const inputFile = Path.join(this.sourceDirectory(), sourceId)
      const outputFile = Path.join(this.outputDirectory(), prefix, sourceId)
      console.log(`[${prefix}] ${Path.relative(process.cwd(), outputFile)}`)

      const url = createUrlOrFileUrl(inputFile)
      const dependencies = new Map()
      const mod = L.load(url, dependencies)
      const basicMod = compileToBasic(mod)
      const outputText = B.prettyMod(globals.maxWidth, basicMod)
      fs.mkdirSync(Path.dirname(outputFile), { recursive: true })
      fs.writeFileSync(outputFile, outputText)
    }
  }

  async buildBasicBundle(): Promise<void> { }

  async buildPassLog(): Promise<void> {
    const prefix = "pass-log"
    for (const sourceId of this.sourceIds()) {
      const inputFile = Path.join(this.sourceDirectory(), sourceId)
      const logFile =
        Path.join(this.outputDirectory(), prefix, sourceId) + ".log"
      console.log(`[${prefix}] ${Path.relative(process.cwd(), logFile)}`)

      const url = createUrlOrFileUrl(inputFile)
      const dependencies = new Map()
      const mod = L.load(url, dependencies)
      fs.mkdirSync(Path.dirname(logFile), { recursive: true })
      fs.writeFileSync(logFile, "")
      compileToPassLog(mod, logFile)
    }
  }
}
