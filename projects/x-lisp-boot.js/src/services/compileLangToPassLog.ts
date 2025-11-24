import * as B from "@xieyuheng/basic-lisp.js"
import * as M from "@xieyuheng/machine-lisp.js"
import fs from "node:fs"
import { globals } from "../globals.ts"
import * as X from "../lang/index.ts"

export function compileLangToPassLog(xMod: X.Mod, logFile?: string): void {
  logXMod("Input", xMod, logFile)
  X.ShrinkPass(xMod)
  logXMod("ShrinkPass", xMod, logFile)
  X.UniquifyPass(xMod)
  logXMod("UniquifyPass", xMod, logFile)
  X.RevealFunctionPass(xMod)
  logXMod("RevealFunctionPass", xMod, logFile)
  X.LiftLambdaPass(xMod)
  logXMod("LiftLambdaPass", xMod, logFile)
  X.UnnestOperandPass(xMod)
  logXMod("UnnestOperandPass", xMod, logFile)
  const basicMod = B.createMod(xMod.url, new Map())
  B.importBuiltin(basicMod)
  X.ExplicateControlPass(xMod, basicMod)
  logBasicMod("ExplicateControlPass", basicMod, logFile)
  const machineMod = M.createMod(xMod.url)
  B.SelectInstructionPass(basicMod, machineMod)
  logMachineMod("SelectInstructionPass", machineMod, logFile)
  M.AssignHomePass(machineMod)
  logMachineMod("AssignHomePass", machineMod, logFile)
  M.PatchInstructionPass(machineMod)
  logMachineMod("PatchInstructionPass", machineMod, logFile)
  M.PrologAndEpilogPass(machineMod)
  logMachineMod("PrologAndEpilogPass", machineMod, logFile)
}

function logXMod(tag: string, xMod: X.Mod, logFile?: string): void {
  logCode(tag, X.prettyMod(globals.maxWidth, xMod), logFile)
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
