---
title: int-compare-descending
---

# Type

```meta-lisp
(-> int-t int-t int-t)
```

# Description

Descending comparison. Returns `-1` if the first is greater than the second, `0` if equal, `1` if less.

# Examples

```meta-lisp
(int-compare-descending 3 2)  ;; => -1
(int-compare-descending 2 2)  ;; => 0
(int-compare-descending 1 2)  ;; => 1
```
