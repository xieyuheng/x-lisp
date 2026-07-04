---
title: int-align
---

# 类型

```scheme
(-> int-t int-t int-t)
```

# 描述

将整数 `n` 对齐到 `alignment` 的整数倍，向上取整。

# 例子

```scheme
(int-align 16 8)    ;; => 16
(int-align 16 16)   ;; => 16
(int-align 16 24)   ;; => 32
```
