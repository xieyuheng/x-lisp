import fs from "node:fs"
import Path from "path"
import * as B from "../basic/index.ts"
import { compileToBasic } from "../compile/index.ts"
import { globals } from "../globals.ts"
import { createUrlOrFileUrl } from "../helpers/url/createUrlOrFileUrl.ts"
import * as L from "../lang/index.ts"
import { type ProjectConfig } from "./ProjectConfig.ts"

export class Project {
  rootDirectory: string
  config: ProjectConfig
  sourceFiles: Array<string> = []

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

  async loadSourceFiles(): Promise<void> {
    this.sourceFiles = fs
      .readdirSync(this.sourceDirectory(), {
        encoding: "utf8",
        recursive: true,
      })
      .filter(
        (file) => !file.startsWith(this.config["build"]["output-directory"]),
      )
      .filter((file) => file.endsWith(".lisp"))
  }

  async build(): Promise<void> {
    await this.loadSourceFiles()
    await this.buildBasic()
  }

  async buildBasic(): Promise<void> {
    const outputPrefix = "basic"
    for (const sourceFile of this.sourceFiles) {
      console.log(`[${outputPrefix}] ${sourceFile}`)
      const inputFile = Path.join(this.sourceDirectory(), sourceFile)
      const url = createUrlOrFileUrl(inputFile)
      const dependencies = new Map()
      const mod = L.load(url, dependencies)
      const basicMod = compileToBasic(mod)
      const outputText = B.prettyMod(globals.maxWidth, basicMod)
      const outputFile = Path.join(
        this.outputDirectory(),
        outputPrefix,
        sourceFile,
      )
      fs.mkdirSync(Path.dirname(outputFile), { recursive: true })
      fs.writeFileSync(outputFile, outputText)
    }
  }
}
