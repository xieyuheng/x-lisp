---
title: branch
---

# 类型

```scheme
(-> bool-t void-t :then-label <symbol> :else-label <symbol>)
```

# 描述

条件分支。`condition` 为 `bool-t` 时跳转到 `:then-label`，否则跳转到 `:else-label`。`branch` 是 terminator 指令，必须位于基本块末尾。

# 例子

```scheme
(= ∅.1 void-t (branch cond :then-label positive :else-label non-positive))
```
