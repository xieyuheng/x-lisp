import fs from "node:fs"
import Path from "node:path"
import * as B from "../basic/index.ts"
import { globals } from "../globals.ts"
import { createUrl } from "../helpers/url/createUrl.ts"
import * as L from "../lang/index.ts"
import * as Services from "../services/index.ts"
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
      .filter((file) => file.endsWith(L.suffix))
  }

  getSourceFile(sourceId: string): string {
    return Path.join(this.sourceDirectory(), sourceId)
  }

  getBasicFile(sourceId: string): string {
    const basicId = sourceId.slice(0, -L.suffix.length) + B.suffix
    return Path.join(this.outputDirectory(), "basic", basicId)
  }

  getBasicBundleFile(sourceId: string): string {
    const bundleId = sourceId.slice(0, -L.suffix.length) + ".bundle" + B.suffix
    return Path.join(this.outputDirectory(), "basic", bundleId)
  }

  async clean(): Promise<void> {
    fs.rmSync(this.outputDirectory(), { recursive: true, force: true })
  }

  async build(): Promise<void> {
    await this.buildPassLog()
    await this.buildBasic()
    await this.buildBasicBundle()
  }

  async buildBasic(): Promise<void> {
    for (const sourceId of this.sourceIds()) {
      const inputFile = this.getSourceFile(sourceId)
      const outputFile = this.getBasicFile(sourceId)
      console.log(`[basic] ${Path.relative(process.cwd(), outputFile)}`)

      const url = createUrl(inputFile)
      const dependencies = new Map()
      const mod = L.load(url, dependencies)
      const basicMod = Services.compileToBasic(mod)
      const outputText = B.prettyMod(globals.maxWidth, basicMod)
      fs.mkdirSync(Path.dirname(outputFile), { recursive: true })
      fs.writeFileSync(outputFile, outputText)
    }
  }

  async buildBasicBundle(): Promise<void> {
    for (const sourceId of this.sourceIds()) {
      if (this.isTest(sourceId) || this.isSnapshot(sourceId)) {
        const inputFile = this.getBasicFile(sourceId)
        const outputFile = this.getBasicBundleFile(sourceId)
        console.log(`[bundle] ${Path.relative(process.cwd(), outputFile)}`)

        const url = createUrl(inputFile)
        const dependencies = new Map()
        const mod = B.load(url, dependencies)
        const bundleMod = B.bundle(mod)
        const outputText = B.prettyMod(globals.maxWidth, bundleMod)
        fs.mkdirSync(Path.dirname(outputFile), { recursive: true })
        fs.writeFileSync(outputFile, outputText)
      }
    }
  }

  getPassLogFile(sourceId: string): string {
    return Path.join(this.outputDirectory(), "pass-log", sourceId) + ".log"
  }

  isTest(sourceId: string): boolean {
    return sourceId.endsWith("test" + L.suffix)
  }

  isSnapshot(sourceId: string): boolean {
    return sourceId.endsWith("snapshot" + L.suffix)
  }

  async buildPassLog(): Promise<void> {
    for (const sourceId of this.sourceIds()) {
      const inputFile = this.getSourceFile(sourceId)
      const logFile = this.getPassLogFile(sourceId)
      console.log(`[pass-log] ${Path.relative(process.cwd(), logFile)}`)

      const url = createUrl(inputFile)
      const dependencies = new Map()
      const mod = L.load(url, dependencies)
      fs.mkdirSync(Path.dirname(logFile), { recursive: true })
      fs.writeFileSync(logFile, "")
      Services.compileToPassLog(mod, logFile)
    }
  }

  async test(): Promise<void> {
    await this.build()
    await this.runTest()
    await this.runSnapshot()
  }

  async runTest(): Promise<void> {
    for (const sourceId of this.sourceIds()) {
      if (this.isTest(sourceId)) {
        const inputFile = this.getBasicBundleFile(sourceId)
        console.log(`[test] ${Path.relative(process.cwd(), inputFile)}`)

        const url = createUrl(inputFile)
        const dependencies = new Map()
        const mod = B.load(url, dependencies)
        B.run(mod)
        const output = B.console.consumeOutput()
        process.stdout.write(output)
      }
    }
  }

  async runSnapshot(): Promise<void> {
    for (const sourceId of this.sourceIds()) {
      if (this.isSnapshot(sourceId)) {
        const inputFile = this.getBasicBundleFile(sourceId)
        const outputFile = this.getSourceFile(sourceId) + ".out"
        console.log(`[snapshot] ${Path.relative(process.cwd(), outputFile)}`)

        const url = createUrl(inputFile)
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
