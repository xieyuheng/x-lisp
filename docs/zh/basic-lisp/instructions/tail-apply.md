---
title: tail-apply
---

# 类型

```scheme
(-> value-t T ... R)
```

# 描述

尾动态调用。语义与 `apply` 相同，但当前栈帧被回收。`tail-apply` 是 terminator 指令。

# 例子

```scheme
(= ∅.1 (tail-apply fn arg1 arg2))
```
