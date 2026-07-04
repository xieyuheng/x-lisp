---
title: float-max
---

# Type

```meta-lisp
(-> float-t float-t float-t)
```

# Description

Return the larger of two floats.

# Examples

```meta-lisp
(float-max 1.0 2.0)     ;; => 2.0
(float-max -1.0 -5.0)   ;; => -1.0
(float-max 0.0 0.0)     ;; => 0.0
```
