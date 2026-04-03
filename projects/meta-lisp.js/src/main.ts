#!/usr/bin/env -S node

import * as cmd from "@xieyuheng/cmd.js"
import { errorReport } from "@xieyuheng/helpers.js/error"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import * as S from "@xieyuheng/sexp.js"
import { fileURLToPath } from "node:url"
import * as M from "./meta/index.ts"
import {
  loadProject,
  projectBuild,
  projectCheck,
  projectClean,
  projectDump,
  projectFromSourcePaths,
  projectTest,
} from "./project/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cmd.createRouter("meta-lisp-compile.js", version)

router.defineRoutes([
  "module:check path",
  "module:interpret path",
  "module:dump path",
  "module:build path",
  "module:test path",
  "project:check --config",
  "project:dump --config",
  "project:build --config",
  "project:test --config",
  "project:clean --config",
])

router.defineHandlers({
  "module:check": ({ args: [path] }) => {
    const dependencyGraph = M.createDependencyGraph()
    M.loadMod(path, dependencyGraph)
    const sourcePaths = M.dependencyGraphModPaths(dependencyGraph)
    const project = projectFromSourcePaths(path, sourcePaths)
    projectCheck(project, dependencyGraph)
  },

  "module:dump": ({ args: [path] }) => {
    const dependencyGraph = M.createDependencyGraph()
    M.loadMod(path, dependencyGraph)
    const sourcePaths = M.dependencyGraphModPaths(dependencyGraph)
    const project = projectFromSourcePaths(path, sourcePaths)
    projectDump(project, dependencyGraph)
  },

  "module:interpret": ({ args: [path] }) => {
    const dependencyGraph = M.createDependencyGraph()
    const mod = M.loadMod(path, dependencyGraph)
    M.dependencyGraphForEachDefinition(dependencyGraph, M.definitionDesugar)
    M.modEvaluateMainIfExists(mod)
  },

  "module:build": ({ args: [path] }) => {
    const dependencyGraph = M.createDependencyGraph()
    M.loadMod(path, dependencyGraph)
    const sourcePaths = M.dependencyGraphModPaths(dependencyGraph)
    const project = projectFromSourcePaths(path, sourcePaths)
    projectBuild(project, dependencyGraph)
  },

  "module:test": ({ args: [path] }) => {
    const dependencyGraph = M.createDependencyGraph()
    M.loadMod(path, dependencyGraph)
    const sourcePaths = M.dependencyGraphModPaths(dependencyGraph)
    const project = projectFromSourcePaths(path, sourcePaths)
    projectTest(project, dependencyGraph)
  },

  "project:check": ({ options }) => {
    const dependencyGraph = M.createDependencyGraph()
    const project = loadProject(options["--config"])
    projectCheck(project, dependencyGraph)
  },

  "project:dump": ({ options }) => {
    const dependencyGraph = M.createDependencyGraph()
    const project = loadProject(options["--config"])
    projectDump(project, dependencyGraph)
  },

  "project:build": ({ options }) => {
    const dependencyGraph = M.createDependencyGraph()
    const project = loadProject(options["--config"])
    projectBuild(project, dependencyGraph)
  },

  "project:test": ({ options }) => {
    const dependencyGraph = M.createDependencyGraph()
    const project = loadProject(options["--config"])
    projectTest(project, dependencyGraph)
  },

  "project:clean": ({ options }) => {
    const project = loadProject(options["--config"])
    projectClean(project)
  },
})

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  if (error instanceof S.ErrorWithSourceLocation) {
    console.log(errorReport(error))
  } else {
    throw error
  }
}
