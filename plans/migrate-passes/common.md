# 通用参考

## 文档

在需要调用 builtin 函数时,**不要盲目猜测名称**,先查阅文档:

- **语法参考**:`docs/zh/reference/syntax.md`
- **内置函数索引**:`docs/zh/reference/builtin/index.md`——所有内置函数的名称、签名、用途
- **FAQ**:`docs/zh/faq/faq.md`

## 已有 pass 参考

- `projects/meta-lisp.meta/src/meta/passes/010-expand-pass.meta`——最完整的参考,展示了:
  - pass 的文件结构(`module meta` + `define` 函数)
  - 如何遍历 fragments 和 stmts
  - 如何构建 AST 节点(`var-exp`、`apply-exp`、`int-exp` 等)
  - 如何操作 hash、list、set
  - 如何使用 `match` 做模式匹配
- `projects/meta-lisp.meta/src/meta/passes/020-desugar-pass.meta`——递归遍历 exp 的典型模式,以及 `desugar` 函数、`create-desugar-state`、`generate-fresh-name` 等
- `projects/meta-lisp.meta/src/meta/passes/030-module-pass.meta`——简单编排者的模式
- `projects/meta-lisp.meta/src/meta/passes/040-execute-pass.meta`——已实现。遍历 mod、处理 stmt、构造 definition 的完整示例

## 类型定义

- `projects/meta-lisp.meta/src/meta/exp/exp.meta`——exp-t 所有变体、binding-t、match-clause-t、cond-clause-t
- `projects/meta-lisp.meta/src/meta/stmt/stmt.meta`——stmt-t 所有变体
- `projects/meta-lisp.meta/src/meta/definition/definition.meta`——definition-t 所有变体、type-constructor-t、data-constructor-t、data-field-t 等
- `projects/meta-lisp.meta/src/meta/mod/mod.meta`——mod-t、claim-entry-t
- `projects/meta-lisp.meta/src/meta/mod/mod-fragment.meta`——mod-fragment-t
- `projects/meta-lisp.meta/src/meta/project/project.meta`——project-t
- `projects/meta-lisp.meta/src/meta/pattern/pattern.meta`——`var-pattern?`、`data-pattern?`、`is-pattern?`、`var-pattern-name`
- `projects/meta-lisp.meta/src/meta/exp/exp-free-names.meta`——`exp-free-names`
- `projects/meta-lisp.meta/src/meta/exp/exp-occurred-names.meta`——`exp-occurred-names`
- `projects/meta-lisp.meta/src/meta/exp/exp-traverse.meta`——`exp-traverse`

## 尚未实现的模块（迁移时可能需要先创建）

以下模块在 JS 侧存在但在 meta-lisp.meta 中**尚未实现**:

- **`definition-check` / 类型检查器**——没有 `src/meta/check/` 目录。080-check-pass 的任务之一是调用 `definition-check`,但该函数尚不存在。迁移 080 时需先实现或跳过类型检查逻辑。
- **`primitive-apply-exp`、`tail-apply-exp`、`function-apply-exp`**——这些 exp-t 的变体尚未在 `exp/exp.meta` 中定义。090-locate-pass 和后续 pass 依赖这些变体,迁移前需先在 `exp.meta` 中添加。
- **`build-pipeline.meta`**——passes 100-150 服务于 build pipeline,该文件尚不存在,需新建。
- **`generate-relative-fresh-name`**——不存在,需要自行实现或使用 `generate-fresh-name`(见 020-desugar-pass.meta)替代。

## 验证命令

```sh
sh scripts/check.sh       # 类型检查
sh scripts/test.sh        # 测试
sh scripts/self-check.sh  # self-hosting 类型检查
```

## 迁移规则

- JS 的 `export function XxxPass(...)` → `.meta` 的 `(define (xxx-pass ...) ...)`,放在 `(module meta)` 声明下
- 所有函数和变量使用 **kebab-case**(如 `mod-name`、`list-each`)
- 精确对应 JS 源码迁移,不猜测、不添加 JS 中不存在的逻辑
- `define-enum`/`define-struct` 中的数据结构会**自动生成**访问器和修改器,使用 `<struct-name>-<field-name>` 模式(如 `mod-fragment-stmts`、`mod-fragment-put-stmts!`、`apply-exp-target`),直接可用,无需额外 import

## 命名映射

| JS (PascalCase / camelCase) | meta (kebab-case) |
|---|---|
| `ExpandPass` | `expand-pass` |
| `projectFragments` | `project-fragments`(struct accessor) |
| `projectLookupMod` | `project-lookup-mod` |
| `createMod` | `make-new-mod` |
| `projectAddMod` | `project-put-mod!` |
| `modDefine` | `mod-define` |
| `modClaim` | `mod-claim` |
| `projectDumpMods` | `project-dump-mods` |
| `projectDumpFragments` | `project-dump-fragments` |
| `FunctionDefinition` | `function-definition`(enum variant constructor) |
| `VariableDefinition` | `variable-definition`(enum variant constructor) |
| `PrimitiveFunctionDeclaration` | `primitive-function-declaration`(enum variant constructor) |
| `PrimitiveVariableDeclaration` | `primitive-variable-declaration`(enum variant constructor) |
| `TypeDefinition` | `type-definition`(enum variant constructor) |
| `AlgebraicTypeDefinition` | `algebraic-type-definition`(enum variant constructor) |
| `OpaqueTypeDefinition` | `opaque-type-definition`(enum variant constructor) |
| `TestDefinition` | `test-definition`(enum variant constructor) |
| `QualifiedVar` | `qualified-var-exp`(enum variant constructor) |
| `Var` | `var-exp`(enum variant constructor) |
| `Let1` | `let1-exp`(enum variant constructor) |
| `Lambda` | `lambda-exp`(enum variant constructor) |
| `Match` | `match-exp`(enum variant constructor) |
| `If` | `if-exp`(enum variant constructor) |
| `Cond`, `CondClause` | `cond-exp`, `make-cond-clause` |
| `Apply` | `apply-exp`(enum variant constructor) |
| `Arrow` | `arrow-exp`(enum variant constructor) |
| `Polymorphic` | `polymorphic-exp`(enum variant constructor) |
| `MatchClause` | `make-match-clause`(struct constructor) |
| `expTraverse` | `exp-traverse` |
| `expFreeNames` | `exp-free-names` |
| `expOccurredNames` | `exp-occurred-names` |
| `isVarPattern` | `var-pattern?` |
| `isDataPattern` | `data-pattern?` |
| `dataConstructorEqual` | 需要自行实现 |

> 注意:`make-` 前缀仅用于 struct 构造(struct 类型的构造函数),enum variant 构造函数直接用 variant 名(不带 `make-`)。
> 例如 `make-claim-entry`(struct) vs `function-definition`(enum variant)。

## 常见陷阱

- `hash-get` 直接返回值(不包在 maybe 中),需先用 `hash-has?` 检查
- `set-member?` 检查 set 中是否有元素
- `set-add!` / `hash-put!` / `list-push!` 使用 `!` 后缀表示 mutate
- `match` 匹配 enum variant 时,模式为 `(variant-name field1 field2 ...)`,字段按定义顺序
- `list-repeat` 函数在 040-execute-pass.meta 中已定义(位于文件末尾),其他 pass 可参考或自行实现
