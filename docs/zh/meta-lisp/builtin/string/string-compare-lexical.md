---
title: string-compare-lexical
---

# 类型

```scheme
(-> string-t string-t int-t)
```

# 描述

字典序比较。如果第一个小于第二个返回 `-1`，相等返回 `0`，大于返回 `1`。

# 例子

```scheme
(string-compare-lexical "a" "b")  ;; => -1
(string-compare-lexical "a" "a")  ;; => 0
(string-compare-lexical "b" "a")  ;; => 1
```
