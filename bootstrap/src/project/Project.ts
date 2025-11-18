import fs from "node:fs"
import Path from "node:path"
import * as B from "../basic/index.ts"
import { globals } from "../globals.ts"
import { systemShellRun } from "../helpers/system/systemShellRun.ts"
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

  clean(): void {
    fs.rmSync(this.outputDirectory(), { recursive: true, force: true })
  }

  forEachSource(f: (id: string) => void) {
    for (const id of this.sourceIds()) {
      f(id)
    }
  }

  build(): void {
    this.forEachSource(this.buildPassLog.bind(this))
    this.forEachSource(this.buildBasic.bind(this))
    this.forEachSource(this.buildBasicBundle.bind(this))
    this.forEachSource(this.buildMachine.bind(this))
    this.forEachSource(this.buildMachineX86assembly.bind(this))
    this.forEachSource(this.buildMachineX86Binary.bind(this))
  }

  buildPassLog(id: string): void {
    const inputFile = this.getSourceFile(id)
    const outputFile = this.getPassLogFile(id)
    this.logFile("pass-log", outputFile)
    const langMod = L.loadEntry(createUrl(inputFile))
    this.writeFile(outputFile, "")
    Services.compileLangToPassLog(langMod, outputFile)
  }

  buildBasic(id: string): void {
    const inputFile = this.getSourceFile(id)
    const outputFile = this.getBasicFile(id)
    this.logFile("basic", outputFile)
    const langMod = L.loadEntry(createUrl(inputFile))
    const basicMod = Services.compileLangToBasic(langMod)
    const outputText = B.prettyMod(globals.maxWidth, basicMod)
    this.writeFile(outputFile, outputText)
  }

  buildBasicBundle(id: string): void {
    if (this.isTest(id) || this.isSnapshot(id)) {
      const inputFile = this.getBasicFile(id)
      const outputFile = this.getBasicBundleFile(id)
      this.logFile("basic-bundle", outputFile)
      const basicMod = B.loadEntry(createUrl(inputFile))
      const basicBundleMod = B.bundle(basicMod)
      const outputText = B.prettyMod(globals.maxWidth, basicBundleMod)
      this.writeFile(outputFile, outputText)
    }
  }

  buildMachine(id: string): void {
    if (this.isTest(id) || this.isSnapshot(id)) {
      const inputFile = this.getBasicBundleFile(id)
      const outputFile = this.getMachineFile(id)
      this.logFile("machine", outputFile)
      const basicBundleMod = B.loadEntry(createUrl(inputFile))
      const machineMod = Services.compileBasicToX86Machine(basicBundleMod)
      const outputText = M.prettyMod(globals.maxWidth, machineMod)
      this.writeFile(outputFile, outputText)
    }
  }

  buildMachineX86assembly(id: string): void {
    if (this.isTest(id) || this.isSnapshot(id)) {
      const inputFile = this.getMachineFile(id)
      const outputFile = this.getMachineFile(id) + ".x86.s"
      this.logFile("x86-assembly", outputFile)
      const machineMod = M.loadEntry(createUrl(inputFile))
      const outputText = M.transpileToX86Assembly(machineMod)
      this.writeFile(outputFile, outputText)
    }
  }

  buildMachineX86Binary(id: string): void {
    if (this.isTest(id) || this.isSnapshot(id)) {
      const inputFile = this.getMachineFile(id) + ".x86.s"
      const outputFile = this.getMachineFile(id) + ".x86"
      this.logFile("x86-binary", outputFile)
      Services.assembleX86FileWithRuntime(inputFile)
    }
  }

  isTest(id: string): boolean {
    return id.endsWith("test" + L.suffix)
  }

  isSnapshot(id: string): boolean {
    return id.endsWith("snapshot" + L.suffix)
  }

  test(): void {
    this.build()
    this.forEachSource(this.runBasicTest.bind(this))
    this.forEachSource(this.runBasicSnapshot.bind(this))
    this.forEachSource(this.runX86Test.bind(this))
    this.forEachSource(this.runX86Snapshot.bind(this))
  }

  runBasicTest(id: string): void {
    if (this.isTest(id)) {
      const inputFile = this.getBasicBundleFile(id)
      this.logFile("basic-test", inputFile)
      const basicBundleMod = B.loadEntry(createUrl(inputFile))
      B.run(basicBundleMod)
      const output = B.console.consumeOutput()
      process.stdout.write(output)
    }
  }

  runBasicSnapshot(id: string): void {
    if (this.isSnapshot(id)) {
      const inputFile = this.getBasicBundleFile(id)
      const outputFile = inputFile + ".out"
      this.logFile("basic-snapshot", outputFile)
      const basicBundleMod = B.loadEntry(createUrl(inputFile))
      B.run(basicBundleMod)
      const outputText = B.console.consumeOutput()
      this.writeFile(outputFile, outputText)
    }
  }

  runX86Test(id: string): void {
    if (this.isTest(id)) {
      const inputFile = this.getMachineFile(id) + ".x86"
      this.logFile("x86-test", inputFile)
      systemShellRun(inputFile, [])
    }
  }

  runX86Snapshot(id: string): void {
    if (this.isSnapshot(id)) {
      const inputFile = this.getMachineFile(id) + ".x86"
      const outputFile = inputFile + ".out"
      this.logFile("x86-snapshot", outputFile)
      systemShellRun(inputFile, [">", outputFile])
    }
  }
}
