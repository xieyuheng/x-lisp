---
title: text-compare-lexical
---

# 类型

```meta-lisp
(-> text-t text-t int-t)
```

# 描述

字典序比较。如果第一个小于第二个返回 `-1`，相等返回 `0`，大于返回 `1`。

# 例子

```meta-lisp
(text-compare-lexical "a" "b")  ;; => -1
(text-compare-lexical "a" "a")  ;; => 0
(text-compare-lexical "b" "a")  ;; => 1
```
