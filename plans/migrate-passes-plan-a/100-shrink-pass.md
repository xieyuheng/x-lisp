# 100-ShrinkPass.ts → 100-shrink-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/100-ShrinkPass.ts`（48 行）
**作用**: 收缩表达式——移除 `(the type exp)` 类型标注节点，递归处理子表达式。
**流水线集成**: 不加入 check-pipeline。仅用于 build-pipeline（该文件需新建: `projects/meta-lisp.meta/src/meta/pipelines/build-pipeline.meta`）。

> 通用指导见 `common.md`。

## 迁移要点

- 函数接受 `project` 和 `options`（含 `dump` 字段）
- 遍历所有 mod 的 definitions，对每个 definition body 递归收缩:
  - 对 `the-exp` → 直接返回其内部 `exp`（去掉类型标注）
  - 对其他表达式 → `exp-traverse` 递归处理子节点
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `(project-dump-mods project "100-shrink")`
- 返回 `void-t`

## 提示

- 这个 pass 非常简单，核心逻辑只有: 遇到 `the-exp` 就剥离
- `the-exp?`、`the-exp-exp`、`the-exp-type` 由 define-enum 自动生成
- `exp-traverse` 在 `exp-traverse.meta` 中

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
