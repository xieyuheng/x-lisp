---
title: float-greater
---

# Type

```meta-lisp
(-> float-t float-t bool-t)
```

# Description

Check if the first float is greater than the second.

# Examples

```meta-lisp
(float-greater 2.0 1.0)    ;; => true
(float-greater 1.0 2.0)    ;; => false
(float-greater 1.0 1.0)    ;; => false
```
