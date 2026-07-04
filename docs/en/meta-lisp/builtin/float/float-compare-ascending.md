---
title: float-compare-ascending
---

# Type

```scheme
(-> float-t float-t int-t)
```

# Description

Ascending comparison. Returns `-1` if the first is less than the second, `0` if equal, `1` if greater.

# Examples

```scheme
(float-compare-ascending 1.0 2.0)  ;; => -1
(float-compare-ascending 2.0 2.0)  ;; => 0
(float-compare-ascending 3.0 2.0)  ;; => 1
```
