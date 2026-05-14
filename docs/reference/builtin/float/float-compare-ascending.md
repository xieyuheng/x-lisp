---
title: float-compare-ascending
---

# 类型

```scheme
(-> float-t float-t int-t)
```

# 描述

升序比较。如果第一个小于第二个返回 `-1`，相等返回 `0`，大于返回 `1`。

# 例子

```scheme
(float-compare-ascending 1.0 2.0)  ;; => -1
(float-compare-ascending 2.0 2.0)  ;; => 0
(float-compare-ascending 3.0 2.0)  ;; => 1
```
