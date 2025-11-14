import fs from "node:fs"
import * as B from "../basic/index.ts"
import { globals } from "../globals.ts"
import * as L from "../lang/index.ts"
import * as M from "../machine/index.ts"

export function compileToPassLog(mod: L.Mod, logFile?: string): void {
  logLangMod("Input", mod, logFile)

  L.ShrinkPass(mod)
  logLangMod("ShrinkPass", mod, logFile)

  L.UniquifyPass(mod)
  logLangMod("UniquifyPass", mod, logFile)

  L.RevealFunctionPass(mod)
  logLangMod("RevealFunctionPass", mod, logFile)

  L.LiftLambdaPass(mod)
  logLangMod("LiftLambdaPass", mod, logFile)

  L.UnnestOperandPass(mod)
  logLangMod("UnnestOperandPass", mod, logFile)

  const basicMod = B.createMod(mod.url)
  B.importBuiltin(basicMod)

  L.ExplicateControlPass(mod, basicMod)
  logBasicMod("ExplicateControlPass", basicMod, logFile)

  const machineMod = M.createMod(mod.url)

  B.SelectInstructionPass(basicMod, machineMod)
  logMachineMod("SelectInstructionPass", machineMod, logFile)
}

function logLangMod(tag: string, mod: L.Mod, logFile?: string): void {
  logCode(tag, L.prettyMod(globals.maxWidth, mod), logFile)
}

function logBasicMod(tag: string, mod: B.Mod, logFile?: string): void {
  logCode(tag, B.prettyMod(globals.maxWidth, mod), logFile)
}

function logMachineMod(tag: string, mod: M.Mod, logFile?: string): void {
  logCode(tag, M.prettyMod(globals.maxWidth, mod), logFile)
}

function logCode(tag: string, modText: string, logFile?: string): void {
  log(`;;; ${tag}\n`, logFile)
  log("\n", logFile)
  log(modText, logFile)
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
