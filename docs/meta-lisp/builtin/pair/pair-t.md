---
title: pair-t
---

# Type

```meta-lisp
type-t
```

# Description

Pair type constructor. `(pair-t A B)` represents a pair containing values of types `A` and `B`. It is a built-in type, represented at runtime as a list of length 2.

# Examples

```meta-lisp
(let ((p (make-pair 1 "hello")))
  (pair-first p))   ;; => 1
```
