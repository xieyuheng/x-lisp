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
    await this.runTest()
    await this.runSnapshot()
  }

  async build(): Promise<void> {
    await this.buildPassLog()
    await this.buildBasic()
    await this.buildBasicBundle()
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

  async buildBasicBundle(): Promise<void> {
    const prefix = "basic"
    for (const sourceId of this.sourceIds()) {
      if (
        sourceId.endsWith(".test.lisp") ||
        sourceId.endsWith(".snapshot.lisp") ||
        sourceId.endsWith(".error.lisp")
      ) {
        const inputFile = Path.join(this.outputDirectory(), prefix, sourceId)
        const outputFile =
          Path.join(this.outputDirectory(), prefix, sourceId) + ".bundle"
        console.log(
          `[${prefix}/bundle] ${Path.relative(process.cwd(), outputFile)}`,
        )

        const url = createUrlOrFileUrl(inputFile)
        const dependencies = new Map()
        const mod = B.load(url, dependencies)
        const bundleMod = B.bundle(mod)
        const outputText = B.prettyMod(globals.maxWidth, bundleMod)
        fs.mkdirSync(Path.dirname(outputFile), { recursive: true })
        fs.writeFileSync(outputFile, outputText)
      }
    }
  }

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

  async runTest(): Promise<void> {
    const prefix = "basic"
    for (const sourceId of this.sourceIds()) {
      if (sourceId.endsWith(".test.lisp")) {
        const inputFile =
          Path.join(this.outputDirectory(), prefix, sourceId) + ".bundle"
        console.log(
          `[${prefix}/test] ${Path.relative(process.cwd(), inputFile)}`,
        )

        const url = createUrlOrFileUrl(inputFile)
        const dependencies = new Map()
        const mod = B.load(url, dependencies)
        B.run(mod)
        const output = B.console.consumeOutput()
        process.stdout.write(output)
      }
    }
  }

  async runSnapshot(): Promise<void> {
    const prefix = "basic"
    for (const sourceId of this.sourceIds()) {
      if (sourceId.endsWith(".snapshot.lisp")) {
        const inputFile =
          Path.join(this.outputDirectory(), prefix, sourceId) + ".bundle"
        const outputFile =
          Path.join(this.sourceDirectory(), sourceId) + ".out"
        console.log(
          `[${prefix}/snapshot] ${Path.relative(process.cwd(), outputFile)}`,
        )

        const url = createUrlOrFileUrl(inputFile)
        const dependencies = new Map()
        const mod = B.load(url, dependencies)
        B.run(mod)
        const outputText = B.console.consumeOutput()
        fs.mkdirSync(Path.dirname(outputFile), { recursive: true })
        fs.writeFileSync(outputFile, outputText)
      }
    }
  }
}
