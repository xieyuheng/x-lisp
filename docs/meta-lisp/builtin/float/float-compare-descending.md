---
title: float-compare-descending
---

# Type

```meta-lisp
(-> float-t float-t int-t)
```

# Description

Descending comparison. Returns `-1` if the first is greater than the second, `0` if equal, `1` if less.

# Examples

```meta-lisp
(float-compare-descending 3.0 2.0)  ;; => -1
(float-compare-descending 2.0 2.0)  ;; => 0
(float-compare-descending 1.0 2.0)  ;; => 1
```
