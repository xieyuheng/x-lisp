---
title: float-max
---

# Type

```scheme
(-> float-t float-t float-t)
```

# Description

Return the larger of two floats.

# Examples

```scheme
(float-max 1.0 2.0)     ;; => 2.0
(float-max -1.0 -5.0)   ;; => -1.0
(float-max 0.0 0.0)     ;; => 0.0
```
