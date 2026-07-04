---
title: float-max
---

# 类型

```meta-lisp
(-> float-t float-t float-t)
```

# 描述

返回两个浮点数中的较大者。

# 例子

```meta-lisp
(float-max 1.0 2.0)     ;; => 2.0
(float-max -1.0 -5.0)   ;; => -1.0
(float-max 0.0 0.0)     ;; => 0.0
```
