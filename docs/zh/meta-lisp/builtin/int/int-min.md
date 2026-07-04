---
title: int-min
---

# 类型

```meta-lisp
(-> int-t int-t int-t)
```

# 描述

返回两个整数中的较小者。

# 例子

```meta-lisp
(int-min 1 2)      ;; => 1
(int-min -1 -5)    ;; => -5
(int-min 0 0)      ;; => 0
```
