#!/usr/bin/env -S node

import * as cmd from "@xieyuheng/cmd.js"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import { createUrl } from "@xieyuheng/helpers.js/url"
import { fileURLToPath } from "node:url"
import * as L from "./lisp/index.ts"
import {
  loadModuleProject,
  loadProject,
  projectBuild,
  projectClean,
  projectInterpret,
  projectTest,
} from "./project/index.ts"
import * as Services from "./services/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cmd.createRouter("x-lisp-compile.js", version)

router.defineRoutes([
  "module:interpret file",
  "module:check file",
  "module:test file",
  "module:build file",
  "project:interpret --config",
  "project:check --config",
  "project:test --config",
  "project:build --config",
  "project:clean --config",
  "file:compile-to-pass-log file",
])

router.defineHandlers({
  "module:interpret": ({ args: [file] }) =>
    projectInterpret(loadModuleProject(file)),
  "module:test": ({ args: [file] }) => projectTest(loadModuleProject(file)),
  "module:build": ({ args: [file] }) => projectBuild(loadModuleProject(file)),
  "project:interpret": ({ options }) =>
    projectInterpret(loadProject(options["--config"])),
  "project:test": ({ options }) =>
    projectTest(loadProject(options["--config"])),
  "project:build": ({ options }) =>
    projectBuild(loadProject(options["--config"])),
  "project:clean": ({ options }) =>
    projectClean(loadProject(options["--config"])),
  "file:compile-to-pass-log": ({ args: [file] }) => {
    const mod = L.loadEntry(createUrl(file))
    Services.compileLispToPassLog(mod)
  },
})

await router.run(process.argv.slice(2))
