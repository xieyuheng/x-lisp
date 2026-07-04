---
title: make-pair
---

# Type

```scheme
(polymorphic (A B) (-> A B (pair-t A B)))
```

# Description

Constructor of `pair-t`, constructs a pair with two values.

# Examples

```scheme
(let ((p (make-pair 1 "hello")))
  (pair-first p))   ;; => 1
```
