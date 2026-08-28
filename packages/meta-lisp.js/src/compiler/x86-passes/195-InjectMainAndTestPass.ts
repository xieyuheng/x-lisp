import * as X86 from "../../x86/index.ts"

// Inject entry wrapper functions so that each executable keeps a single
// compile-time entry and the loader only runs that fixed entry (ELF-like):
//
//   ©test — call ©setup-variables; call ©run-tests; ret
//           (always present: ©setup-variables / ©run-tests are generated
//            unconditionally by ExplicateControlPass, empty when unused)
//
//   ©main — call ©setup-variables; call <entry>; ret
//           (only when an entry is given by build.entry or --entry)

export function InjectMainAndTestPass(
  x86Program: X86.Program,
  entryName: string | undefined,
): void {
  x86Program.definitions.set(
    "©test",
    X86.CodeDefinition("©test", [
      X86.Instr("call", [X86.LabelOperand("©setup-variables")]),
      X86.Instr("call", [X86.LabelOperand("©run-tests")]),
      X86.Instr("ret", []),
    ]),
  )

  if (entryName !== undefined) {
    if (!x86Program.definitions.has(entryName)) {
      let message = `[InjectMainAndTestPass] entry function not found: ${entryName}`
      throw new Error(message)
    }

    x86Program.definitions.set(
      "©main",
      X86.CodeDefinition("©main", [
        X86.Instr("call", [X86.LabelOperand("©setup-variables")]),
        X86.Instr("call", [X86.LabelOperand(entryName)]),
        X86.Instr("ret", []),
      ]),
    )
  }
}
