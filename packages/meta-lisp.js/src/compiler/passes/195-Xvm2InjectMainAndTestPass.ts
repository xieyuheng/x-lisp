import * as X2 from "../../xvm2/index.ts"

// 注入入口包装函数，使每个可执行程序保持单一编译期入口：
//
//   ©test — call-0 ©setup-variables; call-0 ©run-tests; return-void
//           （总是存在：©setup-variables / ©run-tests 由
//            Xvm2ExplicateControlPass 无条件生成，空时为空函数）
//
//   ©main — call-0 ©setup-variables; call-0 <entry>; return-void
//           （仅当给定 build.entry 或 --entry 时）

export function Xvm2InjectMainAndTestPass(
  mod: X2.Mod,
  entryName: string | undefined,
): void {
  mod.definitions.set(
    "©test",
    X2.FunctionDefinition(
      "©test",
      [],
      [
        X2.Instr("call-0", [X2.FnOperand("©setup-variables")]),
        X2.Instr("call-0", [X2.FnOperand("©run-tests")]),
        X2.Instr("return-void", []),
      ],
    ),
  )

  if (entryName !== undefined) {
    if (!mod.definitions.has(entryName)) {
      let message = `[Xvm2InjectMainAndTestPass] entry function not found: ${entryName}`
      throw new Error(message)
    }

    mod.definitions.set(
      "©main",
      X2.FunctionDefinition(
        "©main",
        [],
        [
          X2.Instr("call-0", [X2.FnOperand("©setup-variables")]),
          X2.Instr("call-0", [X2.FnOperand(entryName)]),
          X2.Instr("return-void", []),
        ],
      ),
    )
    mod.entry = entryName
  }
}
