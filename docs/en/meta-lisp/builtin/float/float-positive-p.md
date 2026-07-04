---
title: float-positive?
---

# Type

```meta-lisp
(-> float-t bool-t)
```

# Description

Check if a float is positive (greater than 0.0).

# Examples

```meta-lisp
(float-positive? 1.0)    ;; => true
(float-positive? 0.0)    ;; => false
(float-positive? -1.0)   ;; => false
```
