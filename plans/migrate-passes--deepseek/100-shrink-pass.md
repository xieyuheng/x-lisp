# 100-ShrinkPass.ts → 100-shrink-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/100-ShrinkPass.ts`（48 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/100-shrink-pass.meta`（新建）
**作用**: 收缩表达式——移除 let 绑定的未使用变量、简化常量表达式（如 `(and)` → `true`）。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（`projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`，该文件也需新建）。

## 查阅文档

- 语法形式（`match`、`let`、`and`、`or`、`define` 等）：`docs/zh/reference/syntax.md`
- 内置函数索引：`docs/zh/reference/builtin/index.md`
- hash 操作（`hash-each`、`hash-has?` 等）：`docs/zh/reference/builtin/hash/` 目录
- list 操作：`docs/zh/reference/builtin/list/` 目录
- maybe 操作：`docs/zh/reference/builtin/maybe/` 目录
- **参考已有实现**：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

## 迁移规则

- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 定义在 `define-enum`/`define-struct` 中的数据结构会**自动生成**访问器和修改器，直接可用，无需额外 import

## 迁移要点

- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 遍历所有 mod 的 definitions，递归收缩每个 expression：
  - 对 `let-exp` 检查 binding 是否在被 body 中使用 → 未使用则移除
  - 对 `and-exp` with 空 list → 替换为 `(var-exp 'true)`
  - 对 `or-exp` with 空 list → 替换为 `(var-exp 'false)`
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `project-dump-mods project "100-shrink"`
- 返回 `void-t`

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
