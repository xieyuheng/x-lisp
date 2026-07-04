---
title: int-max
---

# 类型

```meta-lisp
(-> int-t int-t int-t)
```

# 描述

返回两个整数中的较大者。

# 例子

```meta-lisp
(int-max 1 2)      ;; => 2
(int-max -1 -5)    ;; => -1
(int-max 0 0)      ;; => 0
```
