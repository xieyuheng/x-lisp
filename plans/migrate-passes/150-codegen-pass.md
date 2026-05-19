# 150-CodegenPass.ts → 150-codegen-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/150-CodegenPass.ts`（440 行）
**作用**: 将 basic blocks 转换为 stack VM 指令。将 basic IR 转换为 stack IR。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（该文件需新建: `projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`）。

> 通用指导见 `common.md`。

## 重要: 需要先定义 Stack IR 类型

meta-lisp.meta 中**已有** `src/stack/` 目录，但需要确认以下类型是否完整:

```
src/stack/mod.meta         -- stack-mod-t (definitions)
src/stack/definition.meta  -- stack-definition-t (enum: primitive-function-declaration, function-definition, variable-definition, test-definition)
src/stack/operand.meta     -- stack-operand-t (enum: symbol-operand, string-operand, var-operand, int-operand ...)
src/stack/instr.meta       -- stack-instr-t (struct: op, operands, location)
```

如果缺失，需要在迁移前创建（或在 pass 文件中直接定义所需结构体）。

## 迁移要点

- **函数签名**: `(define (codegen-pass project basic-mod) stack-mod)`,接受 project 和 basic-mod,返回 stack-mod
- 在 basic mod 上遍历 definitions，为每个 basic definition 生成 stack definitions
- 核心步骤:
  1. **收集局部变量索引**: 遍历 definition 的所有参数和 instrs（assign 的 dest），分配 local index
  2. **指令翻译**: 每条 basic instr → 一组 stack instr:
     - `assign-instr` → 先处理 exp 的 stack instr，再 `local-store`
     - `perform-instr` → 先处理 exp 的 stack instr，再 `drop`
     - `test-instr` → 处理 exp 的 stack instr（结果在栈顶）
     - `branch-instr` → `jump-if-not` + `jump`
     - `goto-instr` → `jump`
     - `return-instr` → 处理 exp（tail 模式），然后 `return`
  3. **表达式翻译** (`onExp` / `onTailExp`):
     - 字面量 → `literal`
     - `var-exp` → `local-load`（局部变量）或 `global-load`（全局变量）或 `ref`（函数）
     - `apply-exp` → 三种情况:
       - 局部函数/未定义 → `local-load` + `apply`/`tail-apply`
       - 已知函数 `primitive-function-declaration` / `function-definition`:
         - args < arity → 部分 apply (`ref` + `apply`)
         - args == arity → 完整调用 (`call` / `tail-call`)
         - args > arity → 完整调用 + 部分 apply
       - 已知变量 `primitive-variable-declaration` / `variable-definition` → `global-load` + `apply`
- 函数入口: 先 `local-store` 所有参数
- block 入口: `label` 指令
- 返回 stack mod: 包含所有转换后的 stack definitions

## 提示

- 寄存器分配: 用 `make-hash` 记录 symbol → 局部变量 index
- `arity` 用于判断调用模式（apply vs call vs tail-call）
- stack 指令构造器: `make-stack-instr "op" [operands] location`
- 尾调用优化: 在 tail position 的 apply 使用 `tail-apply` / `tail-call`，最终 `return` 结果

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
