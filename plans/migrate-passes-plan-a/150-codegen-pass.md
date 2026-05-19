# 150-CodegenPass.ts → 150-codegen-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/150-CodegenPass.ts`（440 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/150-codegen-pass.meta`（新建）
**作用**: 将 basic blocks 转换为 stack VM 指令。将 basic-form IR 转换为 stack-form。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（`projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`，该文件也需新建）。

## 查阅文档

- 语法形式（`match`、`define`、`let` 等）：`docs/zh/reference/syntax.md`
- 内置函数索引：`docs/zh/reference/builtin/index.md`
- hash 操作（`hash-each`、`hash-has?` 等）：`docs/zh/reference/builtin/hash/` 目录
- list 操作：`docs/zh/reference/builtin/list/` 目录
- int 操作（`iadd`、`isub` 等）：`docs/zh/reference/builtin/int/` 目录
- maybe 操作：`docs/zh/reference/builtin/maybe/` 目录
- **参考已有实现**：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`
- **basic 模块参考**：JS 侧 `projects/meta-lisp.js/src/basic/` 目录
- **stack 模块参考**：JS 侧 `projects/meta-lisp.js/src/stack/` 目录

## 迁移规则

- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 定义在 `define-enum`/`define-struct` 中的数据结构会**自动生成**访问器和修改器，直接可用，无需额外 import
- **重要**：此 pass 的 JS 签名接受 `basicMod` 参数并返回 stack mod — `CodegenPass(project: M.Project, basicMod: B.Mod): Stk.Mod`

## 迁移要点

- 函数接受 `project` 和 `basic-mod`（由 ExplicateControlPass 返回），返回 `stack-mod`
- 需要处理：
  - 寄存器分配（symbol → index mapping）
  - 每个 basic 指令 → 对应 stack 指令
  - label → stack label 映射
  - 控制流指令（goto, if-goto）→ 栈指令的跳转
  - 尾调用优化保留
- 返回 stack mod：包含转换后的 stack 定义
- 与 JS 源码 `M.CodegenPass(project, basicMod): Stk.Mod` 保持一致的输入输出

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
