import * as Xvm from "@xieyuheng/xvm-lisp.js"

// 注入入口包装函数，使每个可执行程序保持单一编译期入口：
//
//   test — call-0 setup-variables; call-0 run-tests; return-void
//           （总是存在：setup-variables / run-tests 由
//            ExplicateControlPass 无条件生成，空时为空函数）
//
//   main — call-0 setup-variables; call-0 <entry>; return-void
//           （仅当给定 build.entry  时）

export function InjectMainAndTestPass(
  program: Xvm.Program,
  entryName: string | undefined,
): void {
  program.definitions.set(
    "test",
    Xvm.FunctionDefinition(
      "test",
      [],
      [
        Xvm.Instr("call-0", [Xvm.FnOperand("setup-variables")]),
        Xvm.Instr("call-0", [Xvm.FnOperand("run-tests")]),
        Xvm.Instr("return-void", []),
      ],
    ),
  )

  if (entryName !== undefined) {
    if (!program.definitions.has(entryName)) {
      let message = `[InjectMainAndTestPass] entry function not found: ${entryName}`
      throw new Error(message)
    }

    program.definitions.set(
      "main",
      Xvm.FunctionDefinition(
        "main",
        [],
        [
          Xvm.Instr("call-0", [Xvm.FnOperand("setup-variables")]),
          Xvm.Instr("call-0", [Xvm.FnOperand(entryName)]),
          Xvm.Instr("return-void", []),
        ],
      ),
    )
  }
}
