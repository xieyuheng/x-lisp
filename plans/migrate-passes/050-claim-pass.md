# 050-ClaimPass.ts → 050-claim-pass.meta

**源文件**: `projects/meta-lisp.js/src/meta/passes/050-ClaimPass.ts`（22 行）
**作用**: 遍历所有 module 的 claimed 条目，检查每个 claimed name 是否已在 admitted 或 definitions 中，未定义的报错。
**流水线集成**: 迁移完成后，编辑 `check-pipeline.meta`，在 `execute-pass` 调用后添加 `(claim-pass project)`

> 通用指导见 `common.md`。

## 迁移要点

- 仅接受 `project` 参数（无 options），返回 `void-t`
- 遍历 `(project-mods project)` 的所有 mod
- 对每个 mod，遍历 `(mod-claimed mod)`（hash），用 `hash-each` 遍历
- 检查：name 既不在 `(mod-admitted mod)`（set）中，也不在 `(mod-definitions mod)`（hash）中 → 报错
- 错误信息包含 module name、name、以及 source location（若 entry.exp 有 location）或 exp

## 验证

在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即为成功。
