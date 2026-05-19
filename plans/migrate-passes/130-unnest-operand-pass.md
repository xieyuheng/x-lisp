# 130-UnnestOperandPass.ts → 130-unnest-operand-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/130-UnnestOperandPass.ts`（131 行）
**作用**: 将嵌套的复杂操作数提升为 let 绑定，确保每个 apply 的操作数都是原子值（变量或字面量）。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（该文件需新建: `projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`）。

> 通用指导见 `common.md`。

## 迁移要点

- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 递归遍历所有 definition bodies
- 核心函数:
  - `forAtom`: 判断表达式是否为原子值（var, qualified-var, symbol, keyword, string, int, float）
    - 原子值 → 直接返回，无需提升
    - 非原子值 → 生成 fresh name，创建 let-binding 提升
    - `apply-exp`: 递归处理 target 和 args 为原子后，整体作为非原子提升
    - `let1-exp`: rhs 作为绑定、body 递归处理后保持
    - `begin1-exp`: head 作为 perform、body 递归处理
- `prependLets`: 收集 let entries，以嵌套 `let1-exp`（或 `begin1-exp` 用于 null name）的形式插入
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `(project-dump-mods project "130-unnest-operand")`
- 返回 `void-t`

## 提示

- `forAtom` 返回两个值可以用 cons pair `(cons entries new-exp)` 传递
- null name 的 entry → `begin1-exp`；有 name 的 entry → `let1-exp`
- 用 state 记录 fresh name counter（如 `freshNameCount: 0`，初始值）
- fresh name 格式: `_.N`
- `apply-exp?`、`apply-exp-target`、`apply-exp-args` 由 define-enum 自动生成

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
