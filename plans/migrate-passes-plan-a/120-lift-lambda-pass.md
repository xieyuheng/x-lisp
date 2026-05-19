# 120-LiftLambdaPass.ts → 120-lift-lambda-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/120-LiftLambdaPass.ts`（92 行）
**目标文件**: `projects/meta-lisp.meta/src/meta/passes/120-lift-lambda-pass.meta`（新建）
**作用**: 将匿名 lambda 提升为顶层函数定义。每个 lambda 会生成一个带唯一名字的顶层 function definition，lambda 位置替换为对该函数的 var-ref。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（`projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`，该文件也需新建）。

## 查阅文档

- 语法形式（`match`、`define`、`lambda`、`let` 等）：`docs/zh/reference/syntax.md`
- 内置函数索引：`docs/zh/reference/builtin/index.md`
- hash 操作（`hash-each`、`hash-has?` 等）：`docs/zh/reference/builtin/hash/` 目录
- list 操作：`docs/zh/reference/builtin/list/` 目录
- symbol 操作：`docs/zh/reference/builtin/symbol/` 目录
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
- 递归遍历所有 mod 的 definition bodies，寻找 `lambda-exp`
- 对每个 lambda：
  - 收集所有自由变量作为额外参数
  - 生成唯一函数名（如 `lambda__N`）
  - 创建顶层 `define-function-stmt`（包含自由变量 + lambda 参数）
  - lambda 位置替换为对该函数的 `var-exp`（applied to 自由变量）
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `project-dump-mods project "120-lift-lambda"`
- 返回 `void-t`

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
