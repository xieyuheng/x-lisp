---
title: swap
---

# Type

```scheme
(polymorphic (A B C)
  (-> (-> A B C)
      (-> B A C)))
```

# Description

Swap the two arguments of a function. Derived function.

# Examples

```scheme
(define (divide a b) (/ a b))
((swap divide) 2 10)  ;; => 5 (equivalent to (divide 10 2))
```
