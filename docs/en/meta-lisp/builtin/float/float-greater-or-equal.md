---
title: float-greater-or-equal
---

# Type

```meta-lisp
(-> float-t float-t bool-t)
```

# Description

Check if the first float is greater than or equal to the second.

# Examples

```meta-lisp
(float-greater-or-equal 2.0 1.0)  ;; => true
(float-greater-or-equal 1.0 1.0)  ;; => true
(float-greater-or-equal 1.0 2.0)  ;; => false
```
