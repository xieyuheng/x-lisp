import * as B from "@xieyuheng/basic-lisp.js"
import * as M from "@xieyuheng/machine-lisp.js"
import fs from "node:fs"
import { globals } from "../globals.ts"
import * as X from "../index.ts"
import * as Passes from "../passes/index.ts"

export function compileLangToPassLog(mod: X.Mod, logFile?: string): void {
  logXMod("Input", mod, logFile)
  Passes.ShrinkPass(mod)
  logXMod("ShrinkPass", mod, logFile)
  Passes.UniquifyPass(mod)
  logXMod("UniquifyPass", mod, logFile)
  Passes.RevealFunctionPass(mod)
  logXMod("RevealFunctionPass", mod, logFile)
  Passes.LiftLambdaPass(mod)
  logXMod("LiftLambdaPass", mod, logFile)
  Passes.UnnestOperandPass(mod)
  logXMod("UnnestOperandPass", mod, logFile)
  const basicMod = B.createMod(mod.url, new Map())
  B.importBuiltin(basicMod)
  Passes.ExplicateControlPass(mod, basicMod)
  logBasicMod("ExplicateControlPass", basicMod, logFile)
  const machineMod = M.createMod(mod.url)
  Passes.SelectInstructionPass(basicMod, machineMod)
  logMachineMod("SelectInstructionPass", machineMod, logFile)
  Passes.AssignHomePass(machineMod)
  logMachineMod("AssignHomePass", machineMod, logFile)
  Passes.PatchInstructionPass(machineMod)
  logMachineMod("PatchInstructionPass", machineMod, logFile)
  Passes.PrologAndEpilogPass(machineMod)
  logMachineMod("PrologAndEpilogPass", machineMod, logFile)
}

function logXMod(tag: string, mod: X.Mod, logFile?: string): void {
  logCode(tag, X.prettyMod(globals.maxWidth, mod), logFile)
}

function logBasicMod(tag: string, basicMod: B.Mod, logFile?: string): void {
  logCode(tag, B.prettyMod(globals.maxWidth, basicMod), logFile)
}

function logMachineMod(tag: string, machineMod: M.Mod, logFile?: string): void {
  logCode(tag, M.prettyMod(globals.maxWidth, machineMod), logFile)
}

function logCode(tag: string, code: string, logFile?: string): void {
  log(`;;; ${tag}\n`, logFile)
  log("\n", logFile)
  log(code, logFile)
  log("\n", logFile)
  log("\n", logFile)
}

function log(text: string, logFile?: string): void {
  if (logFile === undefined) {
    process.stdout.write(text)
  } else {
    fs.appendFileSync(logFile, text)
  }
}
