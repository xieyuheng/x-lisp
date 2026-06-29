# Native x86 Variable Definition Setup

## 上下文

在实现了 native x86 codegen 和 loader 之后，所有 CodeDefinition 被无差别地注册为 FUNCTION_DEFINITION。
`mod_setup`（XVM 的变量初始化过程）在 X86 中没有等价实现。

这导致 VariableDefinition（如 `(define empty-env make-hash)`）的引用（如 `(empty-env)`）
不能在 native x86 中正确工作。

## 尝试的内联 workaround（已放弃）

在 codegen 层的 `compileVar` 中直接内联 VariableDefinition body 的 ReturnInstr 表达式，
跳过 value relocation，避免依赖 loader 的 VariableDefinition 初始化。

```typescript
// 此方案已删除
if (def.kind === "VariableDefinition") {
  return compileVariableDefinitionValue(state, def)
}
```

问题：
- 仅处理单表达式 body（有 ReturnInstr），复杂 VariableDefinition 返回 x_void
- 职责错误：把 runtime 的变量初始化推给了 compile-time
- 与 XVM 的 mod_setup 语义不一致

## 诊断出的五个问题

### 1. x86 汇编标签作用域冲突（已修复）

多个函数的块标签（then.1、else.2、body）在全局 namespace 中冲突。
修复：`layout.ts` 中加入函数作用域化的标签解析。

### 2. Stack 对齐（已修复）

x86-64 ABI 要求 `call` 前 rsp 16 字节对齐。多处违规：
- `native_call.c` trampoline：argc 偶数时不对齐
- JIT prologue：nextLocal 奇数时 frame 偏移不对齐
- `emitDynApply` / `compileStaticCall`：argc 偶数时 `call native-apply` / `call label` 不对齐

修复：三处补充 padding 确保 16 字节对齐。

### 3. CLI 命令重命名（已完成）

- `build` → `build-xvm`
- `build-native` → `build-x86`
- `test` → `test-xvm`
- 新增 `test-x86`

### 4. run-x86-native → run-x86 + --entry 修复（已完成）

旧 `run-x86-native` 无条件执行 x86_call_entry（运行第一个函数），
导致 `--entry` 仍然看到 unwanted 输出。修复为有 `--entry` 时跳过 entry call。

### 5. VariableDefinition 无 setup 流程（待修复）

当前 VariableDefinition 的 value relocation 引用解析到 FUNCTION_DEFINITION（loader 创建），
而不是计算后的值。

## 正确方案（下一迭代）

### 在 .x86.asm 中引入 `define-const` + `define-const-setup`

```asm
;; 声明常量
(define-const self/example/empty-env)

;; 常量的初始化代码，loader 在 value relocation patch 后执行
(define-const-setup self/example/empty-env
  (block self/example/empty-env.prologue
    ...)
  (block body
    ...))
```

### Loader 三阶段加载

Phase 1 (注册+patch):
  - `define-const` → VARIABLE_DEFINITION(x_void) 写入 mod
  - symtab 注册 name → x_void (占位符)
  - 对所有 value relocation 做 patch（此时 VariableDefinition 引用解析为 x_void）

Phase 2 (设置为可执行):
  - mprotect(PROT_EXEC)

Phase 3 (执行 setup):
  - 运行所有 `define-const-setup` 函数:
    value = native_call_native_fn(entry, 0, NULL)
  - 更新 mod: definition->variable_definition.value = value
  - 更新 symtab: name → value
  - 重新 patch 所有引用该 VariableDefinition 的 value relocation offset

### 关键约束

- VariableDefinition setup 必须在 value relocation 全部 patch 之后（setup 函数 body 引用其他定义）
- VariableDefinition setup 必须在 mprotect 之后（代码需要可执行）
- 引用 VariableDefinition 的函数**在 setup 之前不应被调用**（与 XVM mod_setup 语义一致）

### 涉及改动

| 层 | 文件 | 改动 |
|---|---|---|
| codegen | 181-X86CodegenPass.ts | compileVar 保持标准 value relocation 路径（当前状态） |
| assembler | parse/parseStmt.ts | 解析 `define-const` / `define-const-setup` 语句 |
| assembler | assemble/layout.ts | layout 阶段收集 const setup 列表 |
| assembler | assemble/assembleExe.ts | 在 binary header 中记录 const setup 信息 |
| loader | x86/x86.c | 三阶段加载 + re-patch |

## 当前测试状态（无 snapshot）

| 包 | 通过 | 备注 |
|---|---|---|
| meta-builtin | 134/134 | stack 对齐修复后全部通过 |
| meta-example | 179/239 | VariableDefinition 问题导致部分失败（如 lambda-interpreter-test） |

## TODO

- [ ] 实现 `define-const` + `define-const-setup` 汇编语句
- [ ] loader 三阶段加载 + re-patch
- [ ] 排查 heap 损坏（snapshot 模式下清理 crash）
- [ ] 将所有 meta-example 测试恢复到 239/239
