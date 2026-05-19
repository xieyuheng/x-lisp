# 070-QualifyPass.ts → 070-qualify-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/070-QualifyPass.ts`（160 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/070-qualify-pass.meta`（新建）
**作用**: 将模块内的非限定变量引用（不带 module 前缀的 name）加上正确的 module 前缀，生成 QualifiedVar。
**流水线集成**: 迁移完成后，编辑 `projects/meta-lisp.meta/src/meta/pipelines/check-pipeline.meta`，在 `lower-match-pass` 调用后添加 `(qualify-pass project options)`

## 查阅文档

- 语法形式（`match`、`define`、变量引用等）：`docs/zh/reference/syntax.md`
- 内置函数索引：`docs/zh/reference/builtin/index.md`
- hash 操作（`hash-each`、`hash-has?`、`hash-get` 等）：`docs/zh/reference/builtin/hash/` 目录
- maybe 操作（`just`、`nothing`）：`docs/zh/reference/builtin/maybe/` 目录
- error 处理：`docs/zh/reference/builtin/error/error.md`
- **参考已有实现**：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

## 迁移规则

- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 定义在 `define-enum`/`define-struct` 中的数据结构会**自动生成**访问器和修改器，直接可用，无需额外 import

## 迁移要点

- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 遍历每个 mod，对其 definition bodies 中的 `var-exp` 进行 qualify
- 取消限定逻辑：
  - 如果变量名在 mod 的 env 中 → 使用当前 module 的 qualified name
  - 如果不在 → 遍历 imports，检查其他 module 是否有对应 binding
- 处理 qualified import 和 unqualified import
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `project-dump-mods project "070-qualify"`
- 返回 `void-t`

## 已有数据结构

- `mod-t` 的 import 相关字段
- 环境查询函数在 `src/meta/env/env.meta`

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
