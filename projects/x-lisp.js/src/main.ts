#!/usr/bin/env -S node

import * as cmd from "@xieyuheng/cmd.js"
import { getPackageJson } from "@xieyuheng/helpers.js/node"
import { fileURLToPath } from "node:url"
import {
  loadModuleProject,
  loadProject,
  projectCheck,
  projectClean,
  projectInterpret,
} from "./project/index.ts"

const { version } = getPackageJson(fileURLToPath(import.meta.url))

const router = cmd.createRouter("x-lisp-compile.js", version)

router.defineRoutes([
  "module:interpret file",
  "module:check file",
  "project:interpret --config",
  "project:check --config",
  "project:clean --config",
])

router.defineHandlers({
  "module:interpret": ({ args: [file] }) =>
    projectInterpret(loadModuleProject(file)),
  "module:check": ({ args: [file] }) => projectCheck(loadModuleProject(file)),
  "project:interpret": ({ options }) =>
    projectInterpret(loadProject(options["--config"])),
  "project:check": ({ options }) =>
    projectCheck(loadProject(options["--config"])),
  "project:clean": ({ options }) =>
    projectClean(loadProject(options["--config"])),
})

await router.run(process.argv.slice(2))
