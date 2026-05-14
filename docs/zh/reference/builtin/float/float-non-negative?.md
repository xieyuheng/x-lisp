---
title: float-non-negative?
---

# 类型

```scheme
(-> float-t bool-t)
```

# 描述

判断浮点数是否为非负数（大于等于 0.0）。

# 例子

```scheme
(float-non-negative? 0.0)    ;; => true
(float-non-negative? 1.0)    ;; => true
(float-non-negative? -1.0)   ;; => false
```
