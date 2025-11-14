import fs from "node:fs"
import Path from "node:path"
import * as B from "../basic/index.ts"
import { globals } from "../globals.ts"
import { createUrl } from "../helpers/url/createUrl.ts"
import * as L from "../lang/index.ts"
import * as M from "../machine/index.ts"
import * as Services from "../services/index.ts"
import { type ProjectConfig } from "./ProjectConfig.ts"

export class Project {
  rootDirectory: string
  config: ProjectConfig

  constructor(rootDirectory: string, config: ProjectConfig) {
    this.rootDirectory = rootDirectory
    this.config = config
  }

  writeFile(file: string, text: string): void {
    fs.mkdirSync(Path.dirname(file), { recursive: true })
    fs.writeFileSync(file, text)
  }

  logFile(tag: string, file: string): void {
    console.log(`[${tag}] ${Path.relative(process.cwd(), file)}`)
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

  getPassLogFile(sourceId: string): string {
    return Path.join(this.outputDirectory(), "pass-log", sourceId) + ".log"
  }

  getBasicFile(sourceId: string): string {
    return Path.join(
      this.outputDirectory(),
      "basic",
      sourceId.slice(0, -L.suffix.length) + B.suffix,
    )
  }

  getBasicBundleFile(sourceId: string): string {
    return Path.join(
      this.outputDirectory(),
      "basic",
      sourceId.slice(0, -L.suffix.length) + ".bundle" + B.suffix,
    )
  }

  getMachineFile(sourceId: string): string {
    return Path.join(
      this.outputDirectory(),
      "machine",
      sourceId.slice(0, -L.suffix.length) + M.suffix,
    )
  }

  clean(): void {
    fs.rmSync(this.outputDirectory(), { recursive: true, force: true })
  }

  build(): void {
    this.buildPassLog()
    this.buildBasic()
    this.buildBasicBundle()
    this.buildMachine()
    this.buildMachineX86assembly()
  }

  buildPassLog(): void {
    for (const sourceId of this.sourceIds()) {
      const inputFile = this.getSourceFile(sourceId)
      const outputFile = this.getPassLogFile(sourceId)
      this.logFile("pass-log", outputFile)
      const langMod = L.loadEntry(createUrl(inputFile))
      this.writeFile(outputFile, "")
      Services.compileLangToPassLog(langMod, outputFile)
    }
  }

  buildBasic(): void {
    for (const sourceId of this.sourceIds()) {
      const inputFile = this.getSourceFile(sourceId)
      const outputFile = this.getBasicFile(sourceId)
      this.logFile("basic", outputFile)
      const langMod = L.loadEntry(createUrl(inputFile))
      const basicMod = Services.compileLangToBasic(langMod)
      const outputText = B.prettyMod(globals.maxWidth, basicMod)
      this.writeFile(outputFile, outputText)
    }
  }

  buildBasicBundle(): void {
    for (const sourceId of this.sourceIds()) {
      if (this.isTest(sourceId) || this.isSnapshot(sourceId)) {
        const inputFile = this.getBasicFile(sourceId)
        const outputFile = this.getBasicBundleFile(sourceId)
        this.logFile("basic-bundle", outputFile)
        const basicMod = B.loadEntry(createUrl(inputFile))
        const basicBundleMod = B.bundle(basicMod)
        const outputText = B.prettyMod(globals.maxWidth, basicBundleMod)
        this.writeFile(outputFile, outputText)
      }
    }
  }

  buildMachine(): void {
    for (const sourceId of this.sourceIds()) {
      if (this.isTest(sourceId) || this.isSnapshot(sourceId)) {
        const inputFile = this.getBasicBundleFile(sourceId)
        const outputFile = this.getMachineFile(sourceId)
        this.logFile("machine", outputFile)
        const basicBundleMod = B.loadEntry(createUrl(inputFile))
        const machineMod = Services.compileBasicToX86Machine(basicBundleMod)
        const outputText = M.prettyMod(globals.maxWidth, machineMod)
        this.writeFile(outputFile, outputText)
      }
    }
  }

  buildMachineX86assembly(): void {
    for (const sourceId of this.sourceIds()) {
      if (this.isTest(sourceId) || this.isSnapshot(sourceId)) {
        const inputFile = this.getMachineFile(sourceId)
        const outputFile = this.getMachineFile(sourceId) + ".x86.s"
        this.logFile("x86-assembly", outputFile)
        const machineMod = M.loadEntry(createUrl(inputFile))
        const outputText = M.transpileToX86Assembly(machineMod)
        this.writeFile(outputFile, outputText)
      }
    }
  }

  isTest(sourceId: string): boolean {
    return sourceId.endsWith("test" + L.suffix)
  }

  isSnapshot(sourceId: string): boolean {
    return sourceId.endsWith("snapshot" + L.suffix)
  }

  test(): void {
    this.build()
    this.runTest()
    this.runSnapshot()
  }

  runTest(): void {
    for (const sourceId of this.sourceIds()) {
      if (this.isTest(sourceId)) {
        const inputFile = this.getBasicBundleFile(sourceId)
        this.logFile("test", inputFile)
        const basicBundleMod = B.loadEntry(createUrl(inputFile))
        B.run(basicBundleMod)
        const output = B.console.consumeOutput()
        process.stdout.write(output)
      }
    }
  }

  runSnapshot(): void {
    for (const sourceId of this.sourceIds()) {
      if (this.isSnapshot(sourceId)) {
        const inputFile = this.getBasicBundleFile(sourceId)
        const outputFile = this.getSourceFile(sourceId) + ".out"
        this.logFile("snapshot", outputFile)
        const basicBundleMod = B.loadEntry(createUrl(inputFile))
        B.run(basicBundleMod)
        const outputText = B.console.consumeOutput()
        this.writeFile(outputFile, outputText)
      }
    }
  }
}
