# 通用参考

## 文档

在需要调用 builtin 函数时，**不要盲目猜测名称**，先查阅文档：

- **语法参考**：`docs/zh/reference/syntax.md`
- **内置函数索引**：`docs/zh/reference/builtin/index.md` —— 所有内置函数的名称、签名、用途
- **FAQ**：`docs/zh/faq/faq.md`

## 已有 pass 参考

- `projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta` —— 最完整的参考，展示了：
  - pass 的文件结构（`module meta` + `define` 函数）
  - 如何遍历 fragments 和 stmts
  - 如何构建 AST 节点（`var-exp`、`apply-exp`、`int-exp` 等）
  - 如何操作 hash、list、set
  - 如何使用 `match` 做模式匹配
- `projects/meta-lisp.meta/src/meta/passes/020-desugar-pass.meta` —— 递归遍历 exp 的典型模式
- `projects/meta-lisp.meta/src/meta/passes/030-module-pass.meta` —— 简单编排者的模式

## 类型定义

- `projects/meta-lisp.meta/src/meta/exp/exp.meta` —— exp-t 所有变体
- `projects/meta-lisp.meta/src/meta/stmt/stmt.meta` —— stmt-t 所有变体
- `projects/meta-lisp.meta/src/meta/definition/definition.meta` —— definition-t
- `projects/meta-lisp.meta/src/meta/mod/mod.meta` —— mod-t
- `projects/meta-lisp.meta/src/meta/mod/mod-fragment.meta` —— mod-fragment-t
- `projects/meta-lisp.meta/src/meta/value/value.meta` —— value-t
- `projects/meta-lisp.meta/src/meta/type/type.meta` —— type-t

## 验证命令

```sh
sh scripts/check.sh       # 类型检查
sh scripts/test.sh        # 测试
sh scripts/self-check.sh  # self-hosting 类型检查
```

## 命名映射

| JS (PascalCase) | meta (kebab-case) |
|---|---|
| `ExpandPass` | `expand-pass` |
| `projectFragments` | `project-fragments` |
| `projectLookupMod` | `project-lookup-mod` |
| `createMod` | `make-mod` |
| `projectAddMod` | `project-add-mod` |
| `modDefine` | `mod-define` |
| `modClaim` | `mod-claim` |
| `projectDumpMods` | `project-dump-mods` |
| `FunctionDefinition` | `make-function-definition` |
| `VariableDefinition` | `make-variable-definition` |
| ... | `make-<struct-name>` 对应所有 struct 构造函数，accessor 为 `<struct-field-getter>` |
