---
title: int-non-negative?
---

# 类型

```meta-lisp
(-> int-t bool-t)
```

# 描述

判断整数是否为非负数（大于等于 0）。

# 例子

```meta-lisp
(int-non-negative? 0)   ;; => true
(int-non-negative? 1)   ;; => true
(int-non-negative? -1)  ;; => false
```
