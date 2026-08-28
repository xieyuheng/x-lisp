import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/std.js/file"
import * as fs from "node:fs"
import Path from "node:path"
import * as B from "../../../basic/index.ts"
import * as M from "../../../meta/index.ts"
import * as X86 from "../../../x86/index.ts"
import * as X86Backend from "../passes/index.ts"

export function BuildPipeline(
  rootPkg: M.Package,
  entryOverride?: string,
): void {
  M.CorePipeline(rootPkg)

  const basicProgram = X86Backend.ExplicateControlPass(rootPkg)
  B.CopyPropagationPass(basicProgram)
  BasicBundle(rootPkg, basicProgram)

  const ssaReport = B.SsaAnalysisPass(basicProgram)

  if (rootPkg.config.compiler.dump) {
    dumpSsaAnalysisReport(ssaReport, rootPkg)
  }

  const x86Program = X86Backend.SelectInstructionPass(
    rootPkg,
    basicProgram,
    ssaReport,
  )

  const entryName =
    entryOverride ??
    (rootPkg.config.entry ? `${rootPkg.id}/${rootPkg.config.entry}` : undefined)
  X86Backend.InjectMainAndTestPass(x86Program, entryName)

  const homeInfoMap = X86Backend.AllocateRegistersPass(x86Program)
  X86Backend.AssignHomesPass(x86Program, homeInfoMap)
  X86Backend.PatchInstructionsPass(x86Program)
  X86Backend.PrologEpilogPass(x86Program, homeInfoMap)

  X86Bundle(rootPkg, x86Program)
  x86Assemble(rootPkg, x86Program, entryName)
}

function dumpSsaAnalysisReport(
  report: B.SsaAnalysisReport,
  pkg: M.Package,
): void {
  const dir = Path.join(M.packageOutputDirectory(pkg), "dump")
  fs.mkdirSync(dir, { recursive: true })
  const file = Path.join(dir, "175-ssa-analysis-report.huge.dump")
  const content = B.formatSsaAnalysisReport(report)
  fs.writeFileSync(file, content + "\n", "utf-8")
}

function BasicBundle(pkg: M.Package, basicProgram: B.Program): void {
  const directory = M.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.x86.basic`), (file) => {
    const definitions = Array.from(basicProgram.definitions.values())
    const textWidth = 64
    const code = definitions
      .map((definition) => B.formatPrettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}

function X86Bundle(pkg: M.Package, x86Program: X86.Program): void {
  const directory = M.packageOutputDirectory(pkg)
  callWithFile(openOutputFile(`${directory}/bundle.x86.asm`), (file) => {
    // if (pkg.config.entry) {
    //   fileWriteln(file, `(default-entry ${pkg.id}/${pkg.config.entry})`)
    // }
    // PrimitiveTypeDefinition is internal — createProgram() registers the
    // builtin types itself, so the bundle stays re-assemblable by
    // `assemble-x86` (whose parser only knows user-language stmts).
    const definitions = Array.from(x86Program.definitions.values()).filter(
      (definition) => definition.kind !== "PrimitiveTypeDefinition",
    )
    const textWidth = 64
    const code = definitions
      .map((definition) => X86.formatPrettyDefinition(textWidth, definition))
      .join("\n")
    fileWriteln(file, code)
  })
}

// main vs test build: each executable has a single fixed entry.
//   main.x86.exe — entry ©main  (call ©setup-variables; call <entry>)
//   test.x86.exe — entry ©test  (call ©setup-variables; call ©run-tests)
// Without an entry there is no main build — only test.x86.exe is produced.
function x86Assemble(
  pkg: M.Package,
  x86Program: X86.Program,
  entryName: string | undefined,
): void {
  const directory = M.packageOutputDirectory(pkg)
  if (entryName !== undefined) {
    writeExe(`${directory}/main.x86.exe`, x86Program, "©main")
  }
  writeExe(`${directory}/test.x86.exe`, x86Program, "©test")
}

function writeExe(
  pathname: string,
  x86Program: X86.Program,
  entry: string,
): void {
  const exe = X86.assembleExe(x86Program, entry)
  const buf = X86.emitExe(exe)
  fs.writeFileSync(pathname, buf)
}
