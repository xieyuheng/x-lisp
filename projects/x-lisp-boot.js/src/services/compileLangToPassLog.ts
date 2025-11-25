import * as B from "@xieyuheng/basic-lisp.js"
import * as M from "@xieyuheng/machine-lisp.js"
import fs from "node:fs"
import { globals } from "../globals.ts"
import * as X from "../index.ts"
import * as Passes from "../passes/index.ts"

export function compileLangToPassLog(mod: X.Mod, logFile?: string): void {
  logXMod("Input", mod, logFile)
  X.ShrinkPass(mod)
  logXMod("ShrinkPass", mod, logFile)
  X.UniquifyPass(mod)
  logXMod("UniquifyPass", mod, logFile)
  X.RevealFunctionPass(mod)
  logXMod("RevealFunctionPass", mod, logFile)
  X.LiftLambdaPass(mod)
  logXMod("LiftLambdaPass", mod, logFile)
  X.UnnestOperandPass(mod)
  logXMod("UnnestOperandPass", mod, logFile)
  const basicMod = B.createMod(mod.url, new Map())
  B.importBuiltin(basicMod)
  X.ExplicateControlPass(mod, basicMod)
  logBasicMod("ExplicateControlPass", basicMod, logFile)
  const machineMod = M.createMod(mod.url)
  Passes.SelectInstructionPass(basicMod, machineMod)
  logMachineMod("SelectInstructionPass", machineMod, logFile)
  M.AssignHomePass(machineMod)
  logMachineMod("AssignHomePass", machineMod, logFile)
  M.PatchInstructionPass(machineMod)
  logMachineMod("PatchInstructionPass", machineMod, logFile)
  M.PrologAndEpilogPass(machineMod)
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
