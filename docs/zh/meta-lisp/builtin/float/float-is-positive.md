---
title: float-is-positive
---

# 类型

```meta-lisp
(-> float-t bool-t)
```

# 描述

判断浮点数是否为正数（大于 0.0）。

# 例子

```meta-lisp
(float-is-positive 1.0)    ;; => true
(float-is-positive 0.0)    ;; => false
(float-is-positive -1.0)   ;; => false
```
