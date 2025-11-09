import fs from "node:fs"
import * as B from "../basic/index.ts"
import { globals } from "../globals.ts"
import * as L from "../lang/index.ts"

export function compileToPassLog(mod: L.Mod, logFile?: string): void {
  logMod("Input", L.prettyMod(globals.maxWidth, mod), logFile)

  L.ShrinkPass(mod)
  logMod("ShrinkPass", L.prettyMod(globals.maxWidth, mod), logFile)

  L.UniquifyPass(mod)
  logMod("UniquifyPass", L.prettyMod(globals.maxWidth, mod), logFile)

  L.RevealFunctionPass(mod)
  logMod("RevealFunctionPass", L.prettyMod(globals.maxWidth, mod), logFile)

  L.LiftLambdaPass(mod)
  logMod("LiftLambdaPass", L.prettyMod(globals.maxWidth, mod), logFile)

  L.UnnestOperandPass(mod)
  logMod("UnnestOperandPass", L.prettyMod(globals.maxWidth, mod), logFile)

  const basicMod = B.createMod(mod.url)

  L.ExplicateControlPass(mod, basicMod)
  logMod(
    "ExplicateControlPass",
    B.prettyMod(globals.maxWidth, basicMod),
    logFile,
  )
}

function logMod(tag: string, modText: string, logFile?: string): void {
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
