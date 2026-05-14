---
title: int-compare-ascending
---

# 类型

```scheme
(-> int-t int-t int-t)
```

# 描述

升序比较。如果第一个小于第二个返回 `-1`，相等返回 `0`，大于返回 `1`。

# 例子

```scheme
(int-compare-ascending 1 2)   ;; => -1
(int-compare-ascending 2 2)   ;; => 0
(int-compare-ascending 3 2)   ;; => 1
```
