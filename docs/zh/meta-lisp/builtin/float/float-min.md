---
title: float-min
---

# 类型

```scheme
(-> float-t float-t float-t)
```

# 描述

返回两个浮点数中的较小者。

# 例子

```scheme
(float-min 1.0 2.0)     ;; => 1.0
(float-min -1.0 -5.0)   ;; => -5.0
(float-min 0.0 0.0)     ;; => 0.0
```
