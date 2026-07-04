---
title: float-max
---

# 类型

```scheme
(-> float-t float-t float-t)
```

# 描述

返回两个浮点数中的较大者。

# 例子

```scheme
(float-max 1.0 2.0)     ;; => 2.0
(float-max -1.0 -5.0)   ;; => -1.0
(float-max 0.0 0.0)     ;; => 0.0
```
