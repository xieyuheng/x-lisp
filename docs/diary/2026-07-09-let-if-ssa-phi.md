---
title: let + rhs-if 编译到 ssa 与 phi
authors: [xieyuheng, deepseek]
date: 2026-07-09
---

将 `(let ((x rhs)) body)` 中 `rhs` 为 `(if cond then else)` 的绑定展平为基本块后，
两条分支各自向同一个变量 `x` 赋值。编译到 SSA 时该变量必须有唯一定义点，
因此分支内需要用 `provide`（声明提供值）、汇合点用 `use`（创建唯一定义）,
替代普通的 `copy`。

# 为什么只有 let + rhs-if 需要 phi？

只有 `if` 会造成控制流分裂，
而只有 `let` 的 rhs 位置会让分裂的两条分支向同一个变量赋值。

tail 位置各分支独立返回，begin 位置丢弃结果，都不形成 merge。

# 原理

伪代码：

```scheme
(provide ((x rhs)) body)
(use (x) body)
```

用标记 use-sites 集合区分两类情况：

- `x` 已因 rhs-if 被标记时，后续处理中遇到 `x` 的绑定，翻译为 `provide` 而非 `copy`；
- 内层嵌套的 `if` 汇合点不重复发 `use`。

## 带有嵌套的例子

```scheme
(let ((x (if a (if b c d) e)))
  (f x))
```

将 rhs 中的 `if` 提升出来，两侧分支各自绑定 `x`：

```scheme
(if a
  (provide ((x (if b c d)))
    (goto body))
  (provide ((x e))
    (goto body)))

body:
  (use (x)
    (f x))
```

继续内层 `if`：

```scheme
(if a
  (if b
    (provide ((x c))
      (goto inner-body))
    (provide ((x d))
      (goto inner-body)))
  (provide ((x e))
    (goto body)))

inner-body:
  (goto body)

body:
  (use (x)
    (f x))
```

两条内层分支跳到 `inner-body`，`else` 分支直接跳到 `body`。
`inner-body` 仅转发跳转，不放 `use`，因为 `x` 的初次标记发生在外层 `if`，
`use` 必须放在所有 `provide` 路径收束之处。

三条路径（c、d、e）各 `provide` 一次，
在 `body` 汇合为一个 `use`。
`x` 从 `use` 往后唯一定义，满足 SSU（static single use）。

# 总结

只有 `let` 中 rhs 为 `(if ...)` 时才需要 phi，
因为只有该场景让两条分支向同一变量提供值。

标记集 use-sites 在展平过程中传递：

- 首次遇到 let-rhs-if 时标记变量；
- 内层嵌套跳过 `use`；
- 绑定时据此选择 `provide` 或 `copy`。
