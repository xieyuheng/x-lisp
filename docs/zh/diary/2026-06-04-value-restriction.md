---
title: 实现值限制（Value Restriction）修复 Let-多态健全性
author: deepseek-v4-pro
date: 2026-06-04
---

# 问题

在 [meta-builtin.meta] 的 `list-map` 测试中，以下表达式通过了类型检查：

```lisp
(the (list-t int-t)
  (list-map (iadd 1) ["x"]))
```

这显然应该报错——`["x"]` 的元素类型是 `string-t`，而 `list-map` 要求 `(list-t int-t)`。

# 诊断

问题出在 list literal 的 desugar 与 HM 风格 `let`-多态的组合。

`["x"]` desugar 为：

```lisp
(let ((list.1 (make-list)))
  (list-push! "x" list.1)
  list.1)
```

类型检查流程：

1. `(make-list)` 推断类型为 `(list-t E)`（E 是新鲜变量）
2. `Let1Term` 的 `generalizeInCtx` 将 `E` 泛化为 `(polymorphic (E) (list-t E))`
3. `(list-push! "x" list.1)` 中，`list.1` 的多态类型被 freshen，`E_new` 与 `string-t` 合一——但这个约束只作用于当前的 `E_new`，不影响泛化后的类型
4. `let` 表达式的返回值 `list.1` 类型仍是 `(polymorphic (E) (list-t E))` —— **完全未约束**
5. 当 `["x"]` 用在 `(the (list-t int-t) ...)` 中时，freshen 后的 `E` 与 `int-t` 合一 —— **顺利通过**

运行时 XVM 崩溃：`(iadd 1)` 被应用到 `"x"` 上。

# 经典文献

这是 HM 类型系统中的经典问题，称为**值限制（Value Restriction）**。

核心论文：
- Wright, Andrew K. "Simple imperative polymorphism." *LISP and Symbolic Computation* 8.4 (1995): 343-355.

标准反例（SML）：
```sml
val r : 'a list ref = ref []   (* 如果允许这种泛化 *)
r := ["hello"]
val n : int = hd (!r) + 1       (* 运行时拿到字符串 *)
```

# 解决方案：值限制

核心规则：**只有「语法值」（syntactic value）才允许泛化**。

语法值：
- 字面量（`int`、`string`、`symbol`、`keyword`、`float`）
- 变量引用（`VarTerm`、`QualifiedVarTerm`）
- `lambda` 表达式
- `(the Type val)`，若 `val` 是语法值

非语法值：
- **所有函数调用**（`ApplyTerm`）——这是关键
- `let`、`begin`、`if` 等

## 实现

在 `infer.ts` 的 `Let1Term` 分支中，添加 `isSyntacticValueTerm` 检查：

```typescript
if (M.termIsSyntacticValue(exp.rhs)) {
  inferredType = M.generalizeInCtx(ctx, inferredType)
}
// 否则不泛化，保持原始类型（含未解决的 VarType）
```

## 修复效果

修复后，`(make-list)` 作为 `ApplyTerm` 不再被泛化。流程变为：

1. `(make-list)` → `ListType(E)`，不泛化
2. `ctx["list.1"] = ListType(E)`
3. `(list-push! "x" list.1)` → 共享同一个 `E`，合一为 `string-t`，约束应用到 subst
4. 整个 `let` 返回 `ListType(string-t)`（subst 遍历后）
5. `(the (list-t int-t) ...)` 中 `string-t ≠ int-t` → **报错**

# 修复中暴露出的隐藏 Bug

值限制实施后，以下之前被隐藏的类型错误被检出并修复：

| 文件 | 问题 | 修复 |
|---|---|---|
| `list-find.meta` | 异构 list `['a 'b 3 'd]` | 改用同构 list + 适当谓词 |
| `set-union-many.meta` | claim 硬编码 `symbol-t` 而非多态 | 改为 `(polymorphic (E) ...)` |
| `format-type.meta` | `mod-name` 是 symbol 但拼接到 `@string` 中 | 加 `symbol-to-string` |
| `exp-naive-subst.meta` | 用异构 list 模拟 pair | 改用 `make-pair`/`pair-first`/`pair-second` |
| `desugarMatch.ts` | `makeDefaultExp` 用异构 list 构造错误消息 | 改用 `StringConcatExp` |

# 当前限制：仅修复了 `let`

值限制目前只应用于 `Let1Term`（即局部 `let` 绑定）。`tryInferDefinitionBody`（即顶层 `(define x expr)` 没有 `claim` 声明时）**尚未修复**。

顶层定义例如：
```lisp
(define my-list (make-list))
```

仍会因 `tryInferDefinitionBody` 中的无条件泛化而产生与之前相同的 bug。

# 后续计划

为 `tryInferDefinitionBody` 添加值限制需要引入**弱类型变量**（weak type variable）机制——当顶层定义的 RHS 不是语法值时，类型中的自由变量不泛化，而是标记为「弱」。在独立的检查上下文间，弱变量一旦被约束便不可更改。

SML 的语法 `'_a` 即为此目的。这需要修改 `Subst` 数据结构及跨定义检查的合一传播机制。

`definitionCheck.ts:218`：
```typescript
// 当前：无条件泛化
inferredType = M.generalizeInCtx(M.emptyCtx(), inferredType)

// 未来：仅语法值才泛化
if (M.termIsSyntacticValue(exp)) {
  inferredType = M.generalizeInCtx(M.emptyCtx(), inferredType)
}
// 否则：E 保持为自由变量（弱变量），不泛化
```
