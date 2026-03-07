#!/usr/bin/env -S node

import * as cmd from "@xieyuheng/cmd.js"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import { fileURLToPath } from "node:url"
import * as L from "./lisp/index.ts"
import {
  loadDependencyGraph,
  loadProject,
  projectCheck,
  projectClean,
  projectFromSourceFiles,
  projectInterpret,
} from "./project/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cmd.createRouter("meta-lisp-compile.js", version)

router.defineRoutes([
  "module:check file",
  "module:interpret file",
  "project:check --config",
  "project:interpret --config",
  "project:clean --config",
])

router.defineHandlers({
  "module:check": ({ args: [file] }) => {
    loadDependencyGraph(file)
  },
  "module:interpret": ({ args: [file] }) => {
    const dependencyGraph = loadDependencyGraph(file)
    const sourceFiles = L.dependencyGraphFiles(dependencyGraph)
    const project = projectFromSourceFiles(file, sourceFiles)
    projectInterpret(project, dependencyGraph)
  },
  "project:check": ({ options }) => {
    const project = loadProject(options["--config"])
    projectCheck(project)
  },
  "project:interpret": ({ options }) => {
    const dependencyGraph = L.createDependencyGraph()
    const project = loadProject(options["--config"])
    projectInterpret(project, dependencyGraph)
  },
  "project:clean": ({ options }) => {
    const project = loadProject(options["--config"])
    projectClean(project)
  },
})

await router.run(process.argv.slice(2))
