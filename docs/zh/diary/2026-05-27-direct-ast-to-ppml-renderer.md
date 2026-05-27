---
title: direct AST to Ppml.Node renderer
author: opencode/big-pickle
date: 2026-05-27
---

# 直接 AST → Ppml.Node 渲染器

## 背景

`meta-lisp.js` 的 `check --dump` 耗时约 25s。
性能分析显示其中 **98.6% 的时间花在 `formatPrettySexpByFormat` 内部的 `parseSexps()`** 上。

当前 dump 的格式化流程：

```
AST (Exp/Stmt/Definition)
  → format*()                sexp 字符串   (快, 36ms)
  → parseSexps()             Sexp[]       (慢, 24.8s)
  → renderSexp()             Ppml.Node    (快, 102ms)
  → Ppml.format()            string       (快, 106ms)
```

不带 `--dump` 时整个 pipeline 只需 **0.15s**。
瓶颈完全在「格式化为 sexp 字符串 → 重新解析回 Sexp[]」的往返浪费上。

## 任务

为以下 AST 类型实现直接到 `Ppml.Node` 的渲染函数，
跳过 sexp 中间表示。

新的流程：

```
AST (Exp/Stmt/Definition)
  → render*()                Ppml.Node    (新实现)
  → Ppml.format()            string       (已有，已优化)
```

## 需要渲染的 AST 类型

| 类型 | 使用方 | 参考实现 |
|------|--------|---------|
| `M.Stmt<M.Exp>` | `prettyFragmentStmts` | `formatStmt(stmt, formatExp)` |
| `M.Mod` | `prettyModDefinitions` | `formatModDefinitions(mod)` |
| `B.Definition` | `B.prettyDefinition` | `formatDefinition(def)` |
| `Xasm.Definition` | `Xasm.prettyDefinition` | `Xasm.formatDefinition(def)` |

## 关键文件

所有路径相对于 `projects/meta-lisp.js/`：

### ppml 接口
- `../../ppml.js/src/ppml/Node.ts` — 节点类型
- `../../ppml.js/src/ppml/nodeHelper.ts` — 构造辅助函数（text、br、group、indent、concat、flex、wrap、nil）
- `../../ppml.js/src/ppml/format.ts` — `Ppml.format(node, { width })`

### 参考实现（sexp 渲染器，需模仿其布局策略）
- `../../sexp.js/src/pretty/formatPrettySexp.ts` — `renderSexp` 将 `S.Sexp` 映射为 `Ppml.Node`
- `../../sexp.js/src/pretty/formatPrettySexpByFormat.ts` — **待替换的入口**

### AST 相关
- `src/meta/pretty/sexpConfig.ts` — 49 个关键字的 header length 映射
- `src/meta/format/formatExp.ts` 及其同目录文件 — 每种 AST 节点序列化为 sexp 字符串的逻辑（需要生成等价的 Ppml 树）
- `src/meta/exp/`、`src/meta/stmt/`、`src/meta/definition/`、`src/meta/mod/` — AST 类型定义

### 调用点（需要替换）
- `src/meta/project/projectDumpFragments.ts` — 改 `prettyFragmentStmts` → 新渲染函数
- `src/meta/project/projectDumpMods.ts` — 改 `prettyModDefinitions` → 新渲染函数
- `src/meta/pretty/pretty.ts` — 入口定义（`prettyExp`、`prettyFragmentStmts`、`prettyModDefinitions`、`prettyModStmts`）
- `src/basic/pretty/pretty.ts` — `B.prettyDefinition`
- `src/xasm/pretty/pretty.ts` — `Xasm.prettyDefinition`

## 约束

1. 新渲染器必须对相同输入生成 **与当前 sexp 流程一致的输出**（dump 的 diff 才有意义）。
2. `Ppml.format()` 已优化完毕，直接使用即可。
3. 使用 `Ppml.concat` / `Ppml.group` / `Ppml.indent` / `Ppml.br` / `Ppml.text` 等构造文档树。
4. 布局决策完全保留：
   - keyword header length（`renderSyntax`，参见 `formatPrettySexp.ts` 和 `sexpConfig.ts`）
   - short-operator 启发式（名字 <=3 字符的符号用不同缩进）
   - quote/unquote/quasiquote 前缀渲染
   - `@set` / `@square-bracket` 特殊处理
5. 新文件建议放在 `src/meta/pretty/` 下（如 `renderExp.ts`、`renderStmt.ts`、`renderDefinition.ts` 等）。
