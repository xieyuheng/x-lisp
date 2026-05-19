# 060-LowerMatchPass.ts → 060-lower-match-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/060-LowerMatchPass.ts`（305 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/060-lower-match-pass.meta`（新建）
**作用**: 将 `match` 表达式降级为嵌套的 `if`/`case` 表达式。这是 match 模式匹配的核心实现。
**流水线集成**: 迁移完成后，编辑 `projects/meta-lisp.meta/src/meta/pipelines/check-pipeline.meta`，在 `claim-pass` 调用后添加 `(lower-match-pass project options)`

## 查阅文档

- **核心**：`match` 语法、`if`、`let` 表达式：`docs/zh/reference/syntax.md`
- 内置函数索引：`docs/zh/reference/builtin/index.md`
- list 操作（`list-map`、`list-empty?`、`list-head`、`list-tail`、`list-length` 等）：`docs/zh/reference/builtin/list/` 目录
- hash 操作（`hash-each`、`hash-has?` 等）：`docs/zh/reference/builtin/hash/` 目录
- maybe 操作（`just`、`nothing`、`just-value`）：`docs/zh/reference/builtin/maybe/` 目录
- int 操作（`iadd`、`isub` 等）：`docs/zh/reference/builtin/int/` 目录
- symbol 操作（`symbol-concat`、`symbol-to-string`）：`docs/zh/reference/builtin/symbol/` 目录
- string 操作：`docs/zh/reference/builtin/string/` 目录
- error 处理：`docs/zh/reference/builtin/error/error.md`
- **参考已有实现**：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

## 迁移规则

- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 定义在 `define-enum`/`define-struct` 中的数据结构会**自动生成**访问器和修改器，直接可用，无需额外 import

## 迁移要点

- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 遍历 `(project-mods project)`，对每个 mod 的每个定义中的表达式递归做 lower-match
- 降级逻辑：
  - 对 `match-exp`：提取 scrutinee，对每个 clause 生成 case 分支
  - 处理所有 pattern 类型（wildcard, variable, literal, constructor pattern 等）
  - 处理 guard 表达式
  - 确保生成正确的 let-binding 用于模式变量
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `project-dump-mods project "060-lower-match"`
- 返回 `void-t`

## 已有数据结构

- `exp-t` enum（`src/meta/exp/exp.meta`）含 `match-exp`, `if-exp`, `let-exp`, `var-exp`, `apply-exp` 等
- `binding-t` struct
- 模式相关结构在 `exp-t` 的数据构造函数中定义

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
