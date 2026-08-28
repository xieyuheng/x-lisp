import {
  callWithFile,
  fileWriteln,
  openOutputFile,
} from "@xieyuheng/std.js/file"
import * as fs from "node:fs"
import * as B from "../../basic/index.ts"
import * as Compiler from "../../compiler/index.ts"
import * as M from "../../meta/index.ts"
import * as X86 from "../../x86/index.ts"

export function BuildX86Pipeline(
  rootPkg: M.Package,
  entryOverride?: string,
): void {
  const closure = M.packageClosureInTopologicalOrder(rootPkg)

  for (const pkg of closure) M.ExpandPass(pkg)
  for (const pkg of closure) M.ModulePreludePass(pkg)

  const moduleReports = new Map<string, M.ModuleAnalysisReport>()
  for (const pkg of closure)
    moduleReports.set(pkg.id, M.ModuleAnalysisPass(pkg))

  const algebraicReports = new Map<string, M.AlgebraicAnalysisReport>()
  for (const pkg of closure)
    algebraicReports.set(pkg.id, M.AlgebraicAnalysisPass(pkg))

  for (const pkg of closure)
    M.LowerMatchPass(
      pkg,
      moduleReports.get(pkg.id)!,
      algebraicReports.get(pkg.id)!,
    )

  for (const pkg of closure) M.DesugarPass(pkg)
  for (const pkg of closure) M.ModuleImportPass(pkg, moduleReports.get(pkg.id)!)
  for (const pkg of closure) M.SetupPass(pkg)
  for (const pkg of closure) M.ClaimPass(pkg)
  for (const pkg of closure) M.QualifyPass(pkg)
  for (const pkg of closure) M.LocatePass(pkg)
  for (const pkg of closure) M.CheckPass(pkg)
  for (const pkg of closure) M.UniquifyPass(pkg)
  for (const pkg of closure) M.ConvertClosurePass(pkg)
  for (const pkg of closure) M.LimitArityPass(pkg, 6)
  for (const pkg of closure) M.UnnestOperandPass(pkg)

  const basicProgram = Compiler.ExplicateControlPass(rootPkg)
  B.CopyPropagationPass(basicProgram)
  BasicBundle(rootPkg, basicProgram)

  const ssaReport = B.SsaAnalysisPass(rootPkg, basicProgram)

  const x86Program = Compiler.SelectInstructionPass(
    rootPkg,
    basicProgram,
    ssaReport,
  )

  const entryName =
    entryOverride ??
    (rootPkg.config.entry ? `${rootPkg.id}/${rootPkg.config.entry}` : undefined)
  Compiler.InjectMainAndTestPass(x86Program, entryName)

  const homeInfoMap = Compiler.AllocateRegistersPass(x86Program)
  Compiler.AssignHomesPass(x86Program, homeInfoMap)
  Compiler.PatchInstructionsPass(x86Program)
  Compiler.PrologEpilogPass(x86Program, homeInfoMap)

  X86Bundle(rootPkg, x86Program)
  x86Assemble(rootPkg, x86Program, entryName)
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
