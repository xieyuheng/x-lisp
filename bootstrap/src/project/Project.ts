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

  forEachSource(f: (project: Project, id: string) => void) {
    for (const id of this.sourceIds()) {
      f(this, id)
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

  buildPassLog(project: Project, id: string): void {
    const inputFile = project.getSourceFile(id)
    const outputFile = project.getPassLogFile(id)
    project.logFile("pass-log", outputFile)
    const langMod = L.loadEntry(createUrl(inputFile))
    project.writeFile(outputFile, "")
    Services.compileLangToPassLog(langMod, outputFile)
  }

  buildBasic(project: Project, id: string): void {
    const inputFile = project.getSourceFile(id)
    const outputFile = project.getBasicFile(id)
    project.logFile("basic", outputFile)
    const langMod = L.loadEntry(createUrl(inputFile))
    const basicMod = Services.compileLangToBasic(langMod)
    const outputText = B.prettyMod(globals.maxWidth, basicMod)
    project.writeFile(outputFile, outputText)
  }

  buildBasicBundle(project: Project, id: string): void {
    if (project.isTest(id) || project.isSnapshot(id)) {
      const inputFile = project.getBasicFile(id)
      const outputFile = project.getBasicBundleFile(id)
      project.logFile("basic-bundle", outputFile)
      const basicMod = B.loadEntry(createUrl(inputFile))
      const basicBundleMod = B.bundle(basicMod)
      const outputText = B.prettyMod(globals.maxWidth, basicBundleMod)
      project.writeFile(outputFile, outputText)
    }
  }

  buildMachine(project: Project, id: string): void {
    if (project.isTest(id) || project.isSnapshot(id)) {
      const inputFile = project.getBasicBundleFile(id)
      const outputFile = project.getMachineFile(id)
      project.logFile("machine", outputFile)
      const basicBundleMod = B.loadEntry(createUrl(inputFile))
      const machineMod = Services.compileBasicToX86Machine(basicBundleMod)
      const outputText = M.prettyMod(globals.maxWidth, machineMod)
      project.writeFile(outputFile, outputText)
    }
  }

  buildMachineX86assembly(project: Project, id: string): void {
    if (project.isTest(id) || project.isSnapshot(id)) {
      const inputFile = project.getMachineFile(id)
      const outputFile = project.getMachineFile(id) + ".x86.s"
      project.logFile("x86-assembly", outputFile)
      const machineMod = M.loadEntry(createUrl(inputFile))
      const outputText = M.transpileToX86Assembly(machineMod)
      project.writeFile(outputFile, outputText)
    }
  }

  buildMachineX86Binary(project: Project, id: string): void {
    if (project.isTest(id) || project.isSnapshot(id)) {
      const inputFile = project.getMachineFile(id) + ".x86.s"
      const outputFile = project.getMachineFile(id) + ".x86"
      project.logFile("x86-binary", outputFile)
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

  runBasicTest(project: Project, id: string): void {
    if (project.isTest(id)) {
      const inputFile = project.getBasicBundleFile(id)
      project.logFile("basic-test", inputFile)
      const basicBundleMod = B.loadEntry(createUrl(inputFile))
      B.run(basicBundleMod)
      const output = B.console.consumeOutput()
      process.stdout.write(output)
    }
  }

  runBasicSnapshot(project: Project, id: string): void {
    if (project.isSnapshot(id)) {
      const inputFile = project.getBasicBundleFile(id)
      const outputFile = inputFile + ".out"
      project.logFile("basic-snapshot", outputFile)
      const basicBundleMod = B.loadEntry(createUrl(inputFile))
      B.run(basicBundleMod)
      const outputText = B.console.consumeOutput()
      project.writeFile(outputFile, outputText)
    }
  }

  runX86Test(project: Project, id: string): void {
    if (project.isTest(id)) {
      const inputFile = project.getMachineFile(id) + ".x86"
      project.logFile("x86-test", inputFile)
      systemShellRun(inputFile, [])
    }
  }

  runX86Snapshot(project: Project, id: string): void {
    if (project.isSnapshot(id)) {
      const inputFile = project.getMachineFile(id) + ".x86"
      const outputFile = inputFile + ".out"
      project.logFile("x86-snapshot", outputFile)
      systemShellRun(inputFile, [">", outputFile])
    }
  }
}
