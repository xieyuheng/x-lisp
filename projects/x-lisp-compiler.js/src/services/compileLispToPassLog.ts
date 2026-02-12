import fs from "node:fs"
import { textWidth } from "../config.ts"
import * as L from "../lisp/index.ts"
import * as Passes from "../passes/index.ts"

export function compileLispToPassLog(mod: L.Mod, logFile?: string): void {
  logCode("Input", L.prettyModStmts(textWidth, mod), logFile)

  logCode("Loaded", L.prettyModDefinitions(textWidth, mod), logFile)

  Passes.ShrinkPass(mod)
  logCode("ShrinkPass", L.prettyModDefinitions(textWidth, mod), logFile)

  Passes.UniquifyPass(mod)
  logCode("UniquifyPass", L.prettyModDefinitions(textWidth, mod), logFile)

  Passes.RevealGlobalPass(mod)
  logCode("RevealGlobalPass", L.prettyModDefinitions(textWidth, mod), logFile)

  Passes.LiftLambdaPass(mod)
  logCode("LiftLambdaPass", L.prettyModDefinitions(textWidth, mod), logFile)

  Passes.UnnestOperandPass(mod)
  logCode("UnnestOperandPass", L.prettyModDefinitions(textWidth, mod), logFile)
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
