---
title: float-compare-descending
---

# 类型

```scheme
(-> float-t float-t int-t)
```

# 描述

降序比较。如果第一个大于第二个返回 `-1`，相等返回 `0`，小于返回 `1`。

# 例子

```scheme
(float-compare-descending 3.0 2.0)  ;; => -1
(float-compare-descending 2.0 2.0)  ;; => 0
(float-compare-descending 1.0 2.0)  ;; => 1
```
