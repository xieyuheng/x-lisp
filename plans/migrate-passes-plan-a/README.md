# 使用说明

将 `.md` 文件作为 prompt 交给 AI，按编号顺序执行。

## Prompt 模板

```
先阅读 plans/migrate-passes-plan-a/common.md，
再阅读 plans/migrate-passes-plan-a/NNN-pass-name.md，
然后按照后者的指示实现。
```

其中 `common.md` 包含通用指导（文档、类型定义、命名映射、迁移规则等），每个 pass 文件只包含该 pass 特有的任务内容和迁移要点——无 JS 源码粘贴，无重复。

## 验证

每个 pass 完成后在 `projects/meta-lisp.meta/` 下运行 `sh scripts/check.sh`，类型检查通过即成功。

## 注意

- 按编号顺序执行（后续 pass 可能依赖前序）
- 040-090 迁移后需同步更新 `check-pipeline.meta`（各文件内有说明）
- 100-150 服务于 build-pipeline，需新建 `build-pipeline.meta`
- `common.md` 中列出了尚未实现的模块，迁移前需先处理
- 不确定 builtin 函数时查阅 `common.md` 中「文档」章节指向的文档
