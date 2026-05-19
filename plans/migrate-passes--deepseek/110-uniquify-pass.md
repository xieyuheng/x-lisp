# 110-UniquifyPass.ts → 110-uniquify-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/110-UniquifyPass.ts`（112 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/110-uniquify-pass.meta`（新建）
**作用**: 给所有局部变量加上唯一后缀，确保没有变量名遮蔽（shadowing）。每个 lambda/let 绑定的变量会被重命名为 `originalName__N`。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（`projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`，该文件也需新建）。

## 查阅文档

- 语法形式（`match`、`define`、`lambda`、`let` 等）：`docs/zh/reference/syntax.md`
- 内置函数索引：`docs/zh/reference/builtin/index.md`
- hash 操作（`hash-each`、`hash-has?` 等）：`docs/zh/reference/builtin/hash/` 目录
- symbol 操作（`symbol-concat`、`symbol-to-string`）：`docs/zh/reference/builtin/symbol/` 目录
- string 操作：`docs/zh/reference/builtin/string/` 目录
- int 操作（`iadd`）：`docs/zh/reference/builtin/int/` 目录
- **参考已有实现**：`projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`

## 迁移规则

- JS 的 `export function XxxPass(...)` → .meta 的 `(define (xxx-pass ...) ...)`，放在 `(module meta)` 声明下
- 精确对应 JS 源码迁移，不猜测、不添加 JS 中不存在的逻辑
- 变量/字段名使用 kebab-case
- 定义在 `define-enum`/`define-struct` 中的数据结构会**自动生成**访问器和修改器，直接可用，无需额外 import

## 迁移要点

- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 遍历所有 mod 的 definitions
- 对每个函数体/let body 递归重命名：
  - 维护一个 substitution map：原始名 → 新名（带唯一后缀）
  - `var-exp` 中的变量引用替换为新名
  - `lambda-exp` 参数和 `let-exp` 绑定用计数器生成新名
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `project-dump-mods project "110-uniquify"`
- 返回 `void-t`

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
