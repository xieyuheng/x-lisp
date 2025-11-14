import fs from "node:fs"
import * as B from "../basic/index.ts"
import { globals } from "../globals.ts"
import * as L from "../lang/index.ts"
import * as M from "../machine/index.ts"

export function compileLangToPassLog(langMod: L.Mod, logFile?: string): void {
  logLangMod("Input", langMod, logFile)
  L.ShrinkPass(langMod)
  logLangMod("ShrinkPass", langMod, logFile)
  L.UniquifyPass(langMod)
  logLangMod("UniquifyPass", langMod, logFile)
  L.RevealFunctionPass(langMod)
  logLangMod("RevealFunctionPass", langMod, logFile)
  L.LiftLambdaPass(langMod)
  logLangMod("LiftLambdaPass", langMod, logFile)
  L.UnnestOperandPass(langMod)
  logLangMod("UnnestOperandPass", langMod, logFile)
  const basicMod = B.createMod(langMod.url)
  B.importBuiltin(basicMod)
  L.ExplicateControlPass(langMod, basicMod)
  logBasicMod("ExplicateControlPass", basicMod, logFile)
  const machineMod = M.createMod(langMod.url)
  M.externBuiltin(machineMod)
  B.SelectInstructionPass(basicMod, machineMod)
  logMachineMod("SelectInstructionPass", machineMod, logFile)
}

function logLangMod(tag: string, langMod: L.Mod, logFile?: string): void {
  logCode(tag, L.prettyMod(globals.maxWidth, langMod), logFile)
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
