---
title: float-min
---

# 类型

```meta-lisp
(-> float-t float-t float-t)
```

# 描述

返回两个浮点数中的较小者。

# 例子

```meta-lisp
(float-min 1.0 2.0)     ;; => 1.0
(float-min -1.0 -5.0)   ;; => -5.0
(float-min 0.0 0.0)     ;; => 0.0
```
