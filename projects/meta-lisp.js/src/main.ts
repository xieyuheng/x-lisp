#!/usr/bin/env -S node

import * as cmd from "@xieyuheng/cmd.js"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import { createUrl } from "@xieyuheng/helpers.js/url"
import assert from "node:assert"
import { fileURLToPath } from "node:url"
import * as L from "./lisp/index.ts"
import {
  dependencyGraphCheck,
  loadDependencyGraph,
  loadProject,
  projectBuild,
  projectCheck,
  projectClean,
  projectFromSourceFiles,
} from "./project/index.ts"
import * as Services from "./services/index.ts"

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
  "file:compile-to-pass-log file",
])

router.defineHandlers({
  "module:check": ({ args: [file] }) => {
    const dependencyGraph = loadDependencyGraph(file)
    dependencyGraphCheck(dependencyGraph)
  },

  "module:interpret": ({ args: [file] }) => {
    const dependencyGraph = loadDependencyGraph(file)
    const mod = L.loadMod(createUrl(file), dependencyGraph)
    const main = L.modLookupDefinition(mod, "main")
    if (main) {
      assert(main.kind === "FunctionDefinition")
      L.evaluate(mod, L.emptyEnv(), L.desugar(main.body))
    }
  },

  "module:build": ({ args: [file] }) => {
    const dependencyGraph = loadDependencyGraph(file)
    const sourceFiles = L.dependencyGraphFiles(dependencyGraph)
    const project = projectFromSourceFiles(file, sourceFiles)
    projectBuild(project, dependencyGraph)
  },

  "project:check": ({ options }) => {
    const project = loadProject(options["--config"])
    projectCheck(project)
  },

  "project:build": ({ options }) => {
    const dependencyGraph = L.createDependencyGraph()
    const project = loadProject(options["--config"])
    projectBuild(project, dependencyGraph)
  },

  "project:clean": ({ options }) => {
    const project = loadProject(options["--config"])
    projectClean(project)
  },

  "file:compile-to-pass-log": ({ args: [file] }) => {
    const mod = L.loadMod(createUrl(file), L.createDependencyGraph())
    Services.compileLispToPassLog(mod)
  },
})

await router.run(process.argv.slice(2))
