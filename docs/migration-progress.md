# 迁移进度报告：`meta-lisp.js` → `meta-lisp.meta`

## 1. 项目规模对比

| 指标 | JS (bootstrap) | .meta (self-hosting) | 差异 |
|------|:---:|:---:|:---:|
| 源文件 | 72 `.ts` (90+) | 60 `.meta` | -12 |
| 编译器 passes | 18 (010-180) | 1 (010) | **缺失 17 个** |

## 2. 已完全迁移的模块

| 模块 | 说明 |
|------|------|
| `meta/exp/exp-t` | 30 种表达式变体，完整一致 |
| `meta/stmt/stmt-t` | 20 种语句变体，完整一致 |
| `meta/term/term-t` | 18 种核心项变体，完整一致 |
| `meta/type/type-t` | 9 种类型变体，完整一致 |
| `meta/value/value-t` | 3 种运行时值变体，完整一致 |
| `meta/definition/definition-t` | 10 种定义变体，完整一致 |
| `meta/parse/parse-exp` | 解析器，支持所有语法形式 |
| `meta/parse/parse-stmt` | 语句解析器，支持所有语句类型 |
| `meta/pattern/pattern` | 模式匹配工具 |
| `basic/` | 后端 IR 全部迁移 |
| `xasm/` | XVM 汇编 IR 全部迁移 |
| `ppml/` | 漂亮打印整套库 |
| `meta/exp/exp-traverse` | 表达式遍历 |
| `meta/exp/exp-occurred-names` | 收集出现名字 |
| `meta/exp/exp-naive-subst` | 朴素替换 |
| `meta/exp/exp-location` | 提取位置 |
| `meta/term/term-traverse` | 项遍历 |
| `meta/term/term-free-names` | 自由变量 |
| `meta/format/format-definition` | 定义格式化 |
| `meta/format/format-stmt` | 语句格式化 |
| `meta/format/format-mod` | 模块格式化 |
| `meta/format/format-value` | 值格式化 |
| `meta/mod/mod` | 模块数据结构 |
| `meta/mod/mod-fragment` | 片段数据结构 |
| `meta/mod/fragment-scope` | 作用域 |
| `meta/mod/mod-info` | 模块信息 |
| `meta/mod/load-mod-fragment` | 加载片段 |
| `meta/mod/mod-fragment-names` | 片段中的名字 |
| `meta/mod/define` | 注册原语 |
| `meta/mod/zero-location` | 零位置 |
| `meta/project/` | 项目管理（config, load, fragments） |
| `meta/evaluate/env` | 环境 |
| `meta/evaluate/evaluate` | 求值器 |
| `meta/evaluate/apply` | 应用函数 |
| `meta/pretty/sexp-config` | 漂亮打印配置 |
| `meta/type/type-builtin` | 注册内置类型 |

## 3. 关键不一致之处

### 3.1 `ModFragment` 缺少 `path` 和 `desugaredStmts` 字段

- JS `ModFragment`: **有** `path: string` 和 `desugaredStmts: Array<M.Stmt<M.Term>>`
- .meta `mod-fragment-t`: **无** `path`，**无** `desugared-stmts`

后果：片段不知道原始路径（dump 时用 hash key 代替），且无法存储脱糖后的语句。

### 3.2 `Stmt` 缺少类型参数化

- JS: `Stmt<E>` 是泛型，body 可以是 `Exp` 或 `Term`
- .meta: `stmt-t` **硬编码** `exp-t` 作为 body 类型

后果：语句无法重用于 term IR 阶段。

### 3.3 定义 body 类型不匹配（`exp-t` vs `term-t`）

JS 中所有定义体都使用 `M.Term`（脱糖后的核心项），但 .meta 用 `exp-t`：

| `Definition` 变体 | JS body 类型 | .meta body 类型 |
|---|---|---|
| `FunctionDefinition` | `body: M.Term` | `body exp-t` |
| `VariableDefinition` | `body: M.Term` | `body exp-t` |
| `TestDefinition` | `body: M.Term` | `body exp-t` |
| `TypeDefinition` | `body: M.Term` | `body exp-t` |
| `OpaqueTypeDefinition` | `representationType: M.Term` | `representation-type exp-t` |

JS 还有 `definitionCheck.ts` 和 `definitionToDataConstructor.ts` 辅助函数，.meta 没有。

### 3.4 `ClaimedEntry.exp` 类型不匹配

- JS: `exp: M.Term`
- .meta: `exp exp-t`

### 3.5 Env 缺少 `mode` 字段

- JS `Env` 有 `mode: EvaluationMode`（`"OpaqueMode"` \| `"TransparentMode"`）
- .meta `env-t` 只是普通 hash，mode 单独传参

后果：Opaque 类型在透明模式下的展开求值可能受影响。

### 3.6 `evaluate()` 操作错误的 IR 层级

- JS: `evaluate(mod, env, exp)` 参数 `exp: M.Term` — 核心项 IR
- .meta: `evaluate(mode mod env exp)` 参数 `exp: exp-t` — 源码 IR

后果：求值器操作在含语法糖的完整 AST 上，而非简洁的核心项。

### 3.7 `formatDefinition.ts` 使用 `formatTerm` vs `format-exp`

- JS `formatDefinition.ts` 对定义体使用 `M.formatTermBody()` / `M.formatTerm()`（操作 `Term`）
- .meta `format-definition.meta` 使用 `(format-exp body)`（操作 `Exp`）

### 3.8 `format-exp.meta` 不完整

JS `formatExp.ts` 完整处理 30+ 种变体。.meta `format-exp.meta` 有一个兜底 `(else (format-sexp exp))` 对以下类型不做特定格式化：

- `when-exp`, `unless-exp`, `if-exp`, `cond-exp`, `match-exp`
- `letrec-exp`, `letrec-star-exp`, `begin1-exp`, `local-define-exp`
- `assign-exp`, `pipe-exp`, `chain-exp`, `compose-exp`
- `or-exp`, `set-exp`, `the-exp`, `sexp-exp`, `arrow-exp`

且缺少 `formatBody` 特殊 body 格式化逻辑。

### 3.9 JS 独有的函数（.meta 没有对应）

| 文件 | 作用 |
|------|------|
| `meta/format/formatTerm.ts` | Term 格式化 |
| `meta/term/typeFreeVarTypes.ts` | 类型自由变量 |
| `meta/term/typeFreshen.ts` | 类型变量刷新 |
| `meta/definition/definitionCheck.ts` | 定义检查 |
| `meta/definition/definitionToDataConstructor.ts` | 定义到数据构造器转换 |
| `meta/parse/assertNoDuplicatedKey.ts` | 重复键断言 |
| `config.ts` | 文本宽度等配置 |
| `desugar/generateRelativeFreshName.ts` | 生成新鲜名字 |

## 4. 完全未迁移的子系统

### 4.1 脱糖子系统（15 个文件）

`desugar/desugar.ts` + `desugar[And|Or|Begin|Chain|Compose|Pipe|Cond|Hash|List|Set|Sexp|StringConcat|Let|LetStar|Letrec|LetrecStar|Match].ts`

### 4.2 类型检查子系统（6 个文件）

`check/Ctx.ts`, `check.ts`, `infer.ts`, `InferEffect.ts`, `CheckEffect.ts`, `generalizeInCtx.ts`

### 4.3 合一子系统（8 个文件）

`unify/Subst.ts`, `unify.ts`, `reify.ts`, `occurCheck.ts`, `generateSubst.ts`, `substWalk.ts`, `substDeepWalk.ts`, `isSubstitutionInstance.ts`

### 4.4 编译器 Passes（17 个缺失）

| Pass | 作用 | 状态 |
|------|------|:----:|
| 010-ExpandPass | 展开 define-enum 等 | ✅ 已迁移 |
| 020-ModuleInjectBuiltinPass | 注入内置模块 | ❌ |
| 030-ModuleAnalysisPass | 模块分析 | ❌ |
| 040-AlgebraicAnalysisPass | ADT 分析 | ❌ |
| 050-LowerMatchPass | 降低 match | ❌ |
| 060-DesugarPass | 脱糖 | ❌ |
| 070-ModuleImportPass | 导入解析 | ❌ |
| 080-ExecutePass | 执行 | ❌ |
| 090-ClaimPass | 类型声明 | ❌ |
| 100-QualifyPass | 名称限定 | ❌ |
| 110-CheckPass | 类型检查 | ❌ |
| 120-LocatePass | 定位 | ❌ |
| 130-ShrinkPass | 收缩 | ❌ |
| 140-UniquifyPass | 变量唯一化 | ❌ |
| 150-LiftLambdaPass | Lambda 提举 | ❌ |
| 160-UnnestOperandPass | 操作数提取 | ❌ |
| 170-ExplicateControlPass | 控制流显式化 | ❌ |
| 180-CodegenPass | 代码生成 | ❌ |

### 4.5 Pipeline

| Pipeline | 状态 |
|----------|:----:|
| `CheckPipeline` | ⚠️ 只运行 expand-pass，后续 10+ passes 缺失 |
| `BuildPipeline` | ❌ 仅打印 "not implemented" |
| `TestPipeline` | ❌ 仅打印 "not implemented" |

## 5. 迁移进度摘要

| 类别 | 进度 | 说明 |
|------|:---:|------|
| 数据结构定义 | ~100% | exp, stmt, term, type, value, definition 均完整 |
| 解析器 | ~100% | parse-exp, parse-stmt 均完整 |
| 展开 pass | ~100% | 010-expand-pass 与 JS 基本一致 |
| 求值器 | ~100% | evaluate, apply, env 均迁移但操作 IR 层级不同 |
| 格式化 | ~70% | format-exp.meta 缺失 15+ 变体格式化 |
| 项目加载 | ~100% | load-project 等完整 |
| 漂亮打印 | ~100% | ppml 整套完整 |
| **脱糖子系统** | **0%** | 15 个文件未迁移 |
| **类型检查** | **0%** | 6 个文件未迁移 |
| **合一** | **0%** | 8 个文件未迁移 |
| **编译器 Passes** | **~5%** | 17/18 缺失 |
| **Build/Test Pipeline** | **0%** | 未实现 |
