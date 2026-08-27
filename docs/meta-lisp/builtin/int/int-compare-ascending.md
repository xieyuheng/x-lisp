---
title: int-compare-ascending
---

# Type

```meta-lisp
(-> int-t int-t int-t)
```

# Description

Ascending comparison. Returns `-1` if the first is less than the second, `0` if equal, `1` if greater.

# Examples

```meta-lisp
(int-compare-ascending 1 2)   ;; => -1
(int-compare-ascending 2 2)   ;; => 0
(int-compare-ascending 3 2)   ;; => 1
```
