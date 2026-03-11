#!/usr/bin/env -S node

import * as cmd from "@xieyuheng/cmd.js"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import { createUrl } from "@xieyuheng/helpers.js/url"
import assert from "node:assert"
import { fileURLToPath } from "node:url"
import * as L from "./lisp/index.ts"
import {
  loadProject,
  projectBuildPassLog,
  projectCheck,
  projectClean,
  projectFromSourceFiles,
} from "./project/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cmd.createRouter("meta-lisp-compile.js", version)

router.defineRoutes([
  "module:check file",
  "module:interpret file",
  "module:build file",
  // "module:test file",
  "project:check --config",
  "project:build --config",
  // "project:test --config",
  "project:clean --config",
])

router.defineHandlers({
  "module:check": ({ args: [file] }) => {
    const dependencyGraph = L.createDependencyGraph()
    L.loadMod(createUrl(file), dependencyGraph)
    const sourceFiles = L.dependencyGraphFiles(dependencyGraph)
    const project = projectFromSourceFiles(file, sourceFiles)
    projectCheck(project, dependencyGraph)
  },

  "module:build": ({ args: [file] }) => {
    const dependencyGraph = L.createDependencyGraph()
    L.loadMod(createUrl(file), dependencyGraph)
    const sourceFiles = L.dependencyGraphFiles(dependencyGraph)
    const project = projectFromSourceFiles(file, sourceFiles)
    projectBuildPassLog(project, dependencyGraph)
  },

  "module:interpret": ({ args: [file] }) => {
    const dependencyGraph = L.createDependencyGraph()
    const mod = L.loadMod(createUrl(file), dependencyGraph)
    const main = L.modLookupDefinition(mod, "main")
    if (main) {
      assert(main.kind === "FunctionDefinition")
      L.evaluate(mod, L.emptyEnv(), L.desugar(main.body))
    }
  },

  "project:check": ({ options }) => {
    const dependencyGraph = L.createDependencyGraph()
    const project = loadProject(options["--config"])
    projectCheck(project, dependencyGraph)
  },

  "project:build": ({ options }) => {
    const dependencyGraph = L.createDependencyGraph()
    const project = loadProject(options["--config"])
    projectBuildPassLog(project, dependencyGraph)
  },

  "project:clean": ({ options }) => {
    const project = loadProject(options["--config"])
    projectClean(project)
  },
})

await router.run(process.argv.slice(2))
