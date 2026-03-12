#!/usr/bin/env -S node

import * as cmd from "@xieyuheng/cmd.js"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import { createUrl } from "@xieyuheng/helpers.js/url"
import { fileURLToPath } from "node:url"
import * as L from "./lisp/index.ts"
import {
  loadProject,
  projectCheck,
  projectClean,
  projectDump,
  projectFromSourceFiles,
  projectTestByInterpreter,
} from "./project/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cmd.createRouter("meta-lisp-compile.js", version)

router.defineRoutes([
  "module:check file",
  "module:interpret file",
  "module:dump file",
  // "module:test file",
  "project:check --config",
  "project:dump --config",
  // "project:test --config",
  "project:test-by-interpreter --config",
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

  "module:dump": ({ args: [file] }) => {
    const dependencyGraph = L.createDependencyGraph()
    L.loadMod(createUrl(file), dependencyGraph)
    const sourceFiles = L.dependencyGraphFiles(dependencyGraph)
    const project = projectFromSourceFiles(file, sourceFiles)
    projectDump(project, dependencyGraph)
  },

  "module:interpret": ({ args: [file] }) => {
    const dependencyGraph = L.createDependencyGraph()
    const mod = L.loadMod(createUrl(file), dependencyGraph)
    L.dependencyGraphForEachDefinition(dependencyGraph, L.definitionDesugar)
    L.modEvaluateMainIfExists(mod)
  },

  "project:check": ({ options }) => {
    const dependencyGraph = L.createDependencyGraph()
    const project = loadProject(options["--config"])
    projectCheck(project, dependencyGraph)
  },

  "project:dump": ({ options }) => {
    const dependencyGraph = L.createDependencyGraph()
    const project = loadProject(options["--config"])
    projectDump(project, dependencyGraph)
  },

  "project:test-by-interpreter": ({ options }) => {
    const dependencyGraph = L.createDependencyGraph()
    const project = loadProject(options["--config"])
    projectTestByInterpreter(project, dependencyGraph)
  },

  "project:clean": ({ options }) => {
    const project = loadProject(options["--config"])
    projectClean(project)
  },
})

await router.run(process.argv.slice(2))
