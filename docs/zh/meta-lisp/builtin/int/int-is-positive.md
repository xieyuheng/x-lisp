---
title: int-is-positive
---

# 类型

```meta-lisp
(-> int-t bool-t)
```

# 描述

判断整数是否为正数（大于 0）。

# 例子

```meta-lisp
(int-is-positive 1)   ;; => true
(int-is-positive 0)   ;; => false
(int-is-positive -1)  ;; => false
```
