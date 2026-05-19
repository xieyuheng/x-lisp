# 140-ExplicateControlPass.ts → 140-explicate-control-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/140-ExplicateControlPass.ts`（379 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/140-explicate-control-pass.meta`（新建）
**作用**: 显式化控制流——将 if 表达式、函数调用等转换为 basic blocks 和 gotos。这是从高级 IR 到低级 IR 的关键步骤。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（`projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`，该文件也需新建）。

## 查阅文档

- 语法形式（`match`、`define`、`if`、`let` 等）：`docs/zh/reference/syntax.md`
- 内置函数索引：`docs/zh/reference/builtin/index.md`
- hash 操作（`hash-each`、`hash-has?` 等）：`docs/zh/reference/builtin/hash/` 目录
- list 操作：`docs/zh/reference/builtin/list/` 目录
- int 操作（`iadd`）：`docs/zh/reference/builtin/int/` 目录
- maybe 操作：`docs/zh/reference/builtin/maybe/` 目录
- **参考已有实现**：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`
- **basic 模块参考**：JS 侧 `projects/meta-lisp.js/src/basic/` 目录

## 迁移规则

- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 定义在 `define-enum`/`define-struct` 中的数据结构会**自动生成**访问器和修改器，直接可用，无需额外 import
- **重要**：此 pass 的 JS 签名返回 mod 而非 void — `ExplicateControlPass(project: M.Project): B.Mod`

## 迁移要点

- 函数接受 `project`，返回 `basic-mod`（基本块 module）
- 创建新的 basic module（`M.createMod`）
- 遍历所有 mod 的 definitions，将每个 definition 转换为 basic blocks：
  - 函数入口 → `label` 开头
  - `if-exp` → 条件跳转
  - `primitive-apply-exp` → 指令 + 跳转到 next label
  - return 处 → 跳转到 function exit
- 处理 tail call 优化：`tail-apply-exp` → 尾调用指令而非普通调用
- 返回 `basic-mod`：basic module 对象

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
