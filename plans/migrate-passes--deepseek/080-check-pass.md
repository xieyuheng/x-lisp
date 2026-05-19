# 080-CheckPass.ts → 080-check-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/080-CheckPass.ts`（64 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/080-check-pass.meta`（新建）
**作用**: 对所有 module 的 definition 做类型检查。跳过 error module，对每个 definition 调用 definitionCheck。
**流水线集成**: 迁移完成后，编辑 `projects/meta-lisp.meta/src/meta/pipelines/check-pipeline.meta`，在 `qualify-pass` 调用后添加 `(check-pass project options)`

## 查阅文档

- 语法形式（`match`、`define` 等）：`docs/zh/reference/syntax.md`
- 内置函数索引：`docs/zh/reference/builtin/index.md`
- hash 操作（`hash-each`、`hash-has?` 等）：`docs/zh/reference/builtin/hash/` 目录
- error 处理：`docs/zh/reference/builtin/error/error.md`
- **参考已有实现**：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

## 迁移规则

- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 定义在 `define-enum`/`define-struct` 中的数据结构会**自动生成**访问器和修改器，直接可用，无需额外 import

## 迁移要点

- 函数接受 `project` 和 `options`（含 `verbose`, `dump` 字段）
- 遍历 `(project-mods project)`，跳过 error modules
- 对每个 definition 调用 `definition-check`（已定义在 `src/meta/definition/` 下）
- verbose 模式下打印计时信息
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `project-dump-mods project "080-check"`
- 返回 `void-t`

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
