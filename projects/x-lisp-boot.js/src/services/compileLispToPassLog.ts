import fs from "node:fs"
import { globals } from "../globals.ts"
import * as L from "../index.ts"
import * as Passes from "../passes/index.ts"

export function compileLispToPassLog(mod: L.Mod, logFile?: string): void {
  logXMod("Input", mod, logFile)
  Passes.ShrinkPass(mod)
  logXMod("ShrinkPass", mod, logFile)
  Passes.UniquifyPass(mod)
  logXMod("UniquifyPass", mod, logFile)
  Passes.RevealGlobalPass(mod)
  logXMod("RevealGlobalPass", mod, logFile)
  Passes.LiftLambdaPass(mod)
  logXMod("LiftLambdaPass", mod, logFile)
  Passes.UnnestOperandPass(mod)
  logXMod("UnnestOperandPass", mod, logFile)
}

function logXMod(tag: string, mod: L.Mod, logFile?: string): void {
  logCode(tag, L.prettyMod(globals.width, mod), logFile)
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
