---
title: pair-first
---

# Type

```scheme
(polymorphic (A B) (-> (pair-t A B) A))
```

# Description

First element of a pair.

# Examples

```scheme
(let ((p (make-pair 1 "hello")))
  (pair-first p))  ;; => 1
```
