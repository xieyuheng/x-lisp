# 040-ExecutePass.ts → 040-execute-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/040-ExecutePass.ts`（251 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/040-execute-pass.meta`（新建）
**作用**: 将 project.fragments 中的每个 fragment 转换为 module，评估 stmt 并写入 mod 结构中。
**流水线集成**: 迁移完成后，编辑 `projects/meta-lisp.meta/src/meta/pipelines/check-pipeline.meta`，在 `module-pass` 调用后添加 `(execute-pass project options)`

## 查阅文档

- 语法形式（`match`、`define`、`lambda`、`let`、`module`、`claim` 等）：`docs/zh/reference/syntax.md`
- 内置函数索引：`docs/zh/reference/builtin/index.md`
- hash 操作（`hash-each`、`hash-has?` 等）：`docs/zh/reference/builtin/hash/` 目录
- list 操作（`list-map`、`list-flat-map`、`list-empty?` 等）：`docs/zh/reference/builtin/list/` 目录
- maybe 操作（`just`、`nothing`、`just-value` 等）：`docs/zh/reference/builtin/maybe/` 目录
- pair 操作：`docs/zh/reference/builtin/pair/` 目录
- error 处理：`docs/zh/reference/builtin/error/error.md`
- **参考已有实现**：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

## 迁移规则

- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case（如 `mod-name`, `mod-stmts`）
- 定义在 `define-enum`/`define-struct` 中的数据结构会**自动生成**访问器和修改器（如 `mod-fragment-stmts`、`mod-fragment-put-stmts!`、`define-algebraic-type-stmt-type-constructor`），直接可用，无需额外 import

## 迁移要点

- 遍历 `(project-fragments project)`，对每个 fragment 调用 `M.projectLookupMod`（如已存在）或 `M.createMod`
- 对每个 stmt 做 `match stmt`，按 kind 分发：
  - `exempt-stmt`, `claim-stmt`, `claim-type-stmt`, `admit-stmt` → 加入 mod.claimed / mod.admitted
  - `declare-primitive-function-stmt`, `declare-primitive-variable-stmt` → 调用 mod-claim
  - `define-function-stmt`, `define-variable-stmt`, `define-test-stmt` → 调用 mod-define
  - `define-type-stmt`, `define-algebraic-type-stmt`, `define-opaque-type-stmt` → 处理 data-constructors
- 评估 prim 声明时使用 `M.QualifiedVar("builtin", "type-t", location)` 获取类型
- 如果 options 中有 `dump`，调用 `project-dump-mods project "040-execute"`
- 返回 `void-t`

## 已有数据结构

定义在 `projects/meta-lisp.meta/src/meta/` 下，请先阅读相关文件了解字段和访问器：
- `mod-t`: `mod-name`, `mod-stmts`, `mod-admitted`, `mod-claimed`, `mod-definitions`, `mod-data-constructors`
- `project-t`: `project-fragments`, `project-mods`, `project-lookup-mod`, `project-create-mod`
- `env-t`: 环境操作定义在 `src/meta/env/env.meta`
- 评估器定义在 `src/meta/evaluate/evaluate.meta`

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
