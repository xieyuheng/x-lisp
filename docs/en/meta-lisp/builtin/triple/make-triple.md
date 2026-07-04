---
title: make-triple
---

# Type

```scheme
(polymorphic (A B C) (-> A B C (triple-t A B C)))
```

# Description

Constructor of `triple-t`, constructs a triple with three values.

# Examples

```scheme
(let ((t (make-triple 1 "hello" #t)))
  (triple-first t))   ;; => 1
```
