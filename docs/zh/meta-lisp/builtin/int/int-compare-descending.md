---
title: int-compare-descending
---

# 类型

```meta-lisp
(-> int-t int-t int-t)
```

# 描述

降序比较。如果第一个大于第二个返回 `-1`，相等返回 `0`，小于返回 `1`。

# 例子

```meta-lisp
(int-compare-descending 3 2)  ;; => -1
(int-compare-descending 2 2)  ;; => 0
(int-compare-descending 1 2)  ;; => 1
```
