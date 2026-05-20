---
title: int-non-negative?
---

# 类型

```scheme
(-> int-t bool-t)
```

# 描述

判断整数是否为非负数（大于等于 0）。

# 例子

```scheme
(int-non-negative? 0)   ;; => true
(int-non-negative? 1)   ;; => true
(int-non-negative? -1)  ;; => false
```
