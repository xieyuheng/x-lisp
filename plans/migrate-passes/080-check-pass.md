# 080-CheckPass.ts → 080-check-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/080-CheckPass.ts`（64 行）
**作用**: 对所有 module 的 definition 做类型检查。跳过 error module，对每个 definition 调用类型检查。
**流水线集成**: 迁移完成后，编辑 `check-pipeline.meta`，在 `qualify-pass` 调用后添加 `(check-pass project options)`

> 通用指导见 `common.md`。

## 重要: `definition-check` 尚未实现

JS 侧的 `CheckPass` 调用 `definitionCheck(definition)` 做类型检查，但 meta-lisp.meta 中**没有** `src/meta/check/` 目录,`definition-check` 函数**不存在**。

迁移此 pass 时有两种处理方式:
1. **先实现类型检查器**（在 `src/meta/check/` 下创建），再迁移此 pass
2. **暂时跳过类型检查逻辑**，让 check-pass 仅做遍历和 dump，类型检查部分留待后续

## 迁移要点

- 函数接受 `project` 和 `options`（含 `verbose`, `dump` 字段）
- 遍历 `(project-mods project)`，跳过 error modules（`mod-is-error-module`）
- 对每个 definition 调用 `definition-check`（需先实现或跳过）
- verbose 模式下打印计时信息（用 `log` 函数或简化为 `writeln`）
- error module 的错误输出可先简化处理（直接 `writeln` 或不输出）
- 使用 dump: 若 `(hash-has? 'dump options)` 则调用 `(project-dump-mods project "080-check")`
- 返回 `void-t`

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
