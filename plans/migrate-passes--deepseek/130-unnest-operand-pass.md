# 130-UnnestOperandPass.ts → 130-unnest-operand-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/130-UnnestOperandPass.ts`（131 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/130-unnest-operand-pass.meta`（新建）
**作用**: 将嵌套的复杂操作数提升为 let 绑定，确保每个 primitive apply 的操作数都是原子值（变量或字面量）。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（`projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`，该文件也需新建）。

## 查阅文档

- 语法形式（`match`、`define`、`let` 等）：`docs/zh/reference/syntax.md`
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
- 递归遍历所有 definition bodies
- 对每个 `primitive-apply-exp`：检查每个参数是否为原子值
  - 非原子参数（如 `(+ (+ 1 2) 3)` 中的 `(+ 1 2)`）→ 提升为 `let` 绑定
- 对每个 `apply-exp` / `tail-apply-exp` / `function-apply-exp` 类似处理
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `project-dump-mods project "130-unnest-operand"`
- 返回 `void-t`

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
