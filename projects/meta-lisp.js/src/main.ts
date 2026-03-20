#!/usr/bin/env -S node

import * as cmd from "@xieyuheng/cmd.js"
import { errorReport } from "@xieyuheng/helpers.js/error"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import * as S from "@xieyuheng/sexp.js"
import { fileURLToPath } from "node:url"
import * as L from "./lisp/index.ts"
import {
  loadProject,
  projectCheck,
  projectClean,
  projectDump,
  projectFromSourcePaths,
  projectTestByInterpreter,
} from "./project/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cmd.createRouter("meta-lisp-compile.js", version)

router.defineRoutes([
  "module:check path",
  "module:interpret path",
  "module:dump path",
  // "module:test path",
  "project:check --config",
  "project:dump --config",
  // "project:test --config",
  "project:test-by-interpreter --config",
  "project:clean --config",
])

router.defineHandlers({
  "module:check": ({ args: [path] }) => {
    const dependencyGraph = L.createDependencyGraph()
    L.loadMod(path, dependencyGraph)
    const sourcePaths = L.dependencyGraphModPaths(dependencyGraph)
    const project = projectFromSourcePaths(path, sourcePaths)
    projectCheck(project, dependencyGraph)
  },

  "module:dump": ({ args: [path] }) => {
    const dependencyGraph = L.createDependencyGraph()
    L.loadMod(path, dependencyGraph)
    const sourcePaths = L.dependencyGraphModPaths(dependencyGraph)
    const project = projectFromSourcePaths(path, sourcePaths)
    projectDump(project, dependencyGraph)
  },

  "module:interpret": ({ args: [path] }) => {
    const dependencyGraph = L.createDependencyGraph()
    const mod = L.loadMod(path, dependencyGraph)
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

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  if (error instanceof S.ErrorWithMeta) {
    console.log(errorReport(error))
  } else {
    throw error
  }
}
