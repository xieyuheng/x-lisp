# 使用说明

将 `.md` 文件作为 prompt 交给 AI，按编号顺序执行：

## Prompt 模板

```
请阅读 @prompts/migrate-passes--deepseek/NNN-pass-name.md 并执行其中的任务。
```

## 验证

每个 pass 完成后在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即成功。

## 注意

- 每个文件独立，按编号顺序执行（后续 pass 可能依赖前序）
- 040-090 迁移后需同步更新 `check-pipeline.meta`（文件内有说明）
- 不确定 builtin 函数时查阅 prompt 中「查阅文档」章节指向的文档
