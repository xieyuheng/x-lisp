---
title: float-min
---

# Type

```scheme
(-> float-t float-t float-t)
```

# Description

Return the smaller of two floats.

# Examples

```scheme
(float-min 1.0 2.0)     ;; => 1.0
(float-min -1.0 -5.0)   ;; => -5.0
(float-min 0.0 0.0)     ;; => 0.0
```
