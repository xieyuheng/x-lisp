---
title: let + rhs-if 编译到 ssa 与 phi
authors: [xieyuheng, deepseek-v4-pro]
date: 2026-07-09
---

将 `(let ((x rhs)) body)` 中 `rhs` 为 `(if cond then else)` 的绑定展平为基本块后，
两条分支各自向同一个变量 `x` 赋值。编译到 SSA 时该变量必须有唯一定义点，
因此分支内需要用 `provide`（声明提供值）、汇合点用 `use`（创建唯一定义）,
替代普通的 `copy`。

# 为什么只有 let + rhs-if 需要 phi？

审查全部控制流构造：

| 构造               | 控制流分裂？ | 向同一变量赋值？                 | 需要 phi？ |
|--------------------|--------------|----------------------------------|------------|
| `let`              | 否           | —                               | 否         |
| `begin`            | 否           | —                               | 否         |
| 函数调用           | 否           | —                               | 否         |
| 常量               | 否           | —                               | 否         |
| `if` 在 tail 位置  | 是           | 各分支独立 `return`/`tail-apply` | 否         |
| `if` 在 begin 位置 | 是           | 不绑定变量                       | 否         |
| `if` 在 let 的 rhs | 是           | 两侧分支都向变量提供值           | **是**     |

# 原理

用 `provide`/`use` 虚构操作表达语义：

- `(provide x expr)`：当前路径上 `expr` 的结果是变量 `x` 的一个提供值
- `(use x)`：汇合所有到达 `x` 的 `provide`，创建 `x` 的唯一定义
- `(copy x expr)`：非分支场景下的普通赋值

用标记集合区分两类情况：`x` 已因 rhs-if 被标记时，后续处理中遇到 `x`
的绑定发 `provide` 而非 `copy`；内层嵌套的 `if` 汇合点不重复发 `use`。

# 嵌套示例

```scheme
(let ((x (if a
              (if b c d)
              e)))
  body)
```

## 外层展开

将 rhs 中的 `if` 提升出来，两侧分支各自绑定 `x`：

```scheme
(if a
  (begin
    (provide x (if b c d))
    (goto merge-outer))
  (begin
    (provide x e)
    (goto merge-outer)))
```

## 内层展开

`else` 分支 `(provide x e)` 已扁平，继续展开 `then` 分支中的内层 `if`：

```scheme
(if a
  (if b
    (begin
      (provide x c)
      (goto merge-inner))
    (begin
      (provide x d)
      (goto merge-inner)))
  (begin
    (provide x e)
    (goto merge-outer)))
```

## 汇合

两条内层分支跳到 `merge-inner`，`else` 分支直接跳到 `merge-outer`。
`merge-inner` 仅转发跳转，不放 `use`——因为 `x` 的初次标记发生在外层
`if`，`use` 必须放在所有 `provide` 路径收束之处。

```scheme
merge-inner:
  (goto merge-outer)

merge-outer:
  (use x)
  body
```

三条路径（c、d、e）各 `provide` 一次，在 `merge-outer` 汇合为一个
`use`。`x` 从 `use` 往后唯一定义，满足 SSA。

# 总结

- 只有 `let` 中 rhs 为 `(if ...)` 时才需要 phi，因为只有该场景让两条分支
  向同一变量提供值
- 标记集在展平过程中传递：首次遇到 let-rhs-if 时标记变量，内层嵌套跳过
  `use`，绑定时据此选择 `provide` 或 `copy`
- 该方案不引入新的递归函数，无需修改调用签名
