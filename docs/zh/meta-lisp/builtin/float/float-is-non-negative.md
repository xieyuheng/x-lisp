---
title: float-is-non-negative
---

# 类型

```meta-lisp
(-> float-t bool-t)
```

# 描述

判断浮点数是否为非负数（大于等于 0.0）。

# 例子

```meta-lisp
(float-is-non-negative 0.0)    ;; => true
(float-is-non-negative 1.0)    ;; => true
(float-is-non-negative -1.0)   ;; => false
```
