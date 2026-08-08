---
title: swap
---

# Type

```meta-lisp
(all (A B C)
  (-> (-> A B C)
      (-> B A C)))
```

# Description

Swap the two arguments of a function.

# Examples

```meta-lisp
(define (divide a b) (/ a b))
((swap divide) 2 10)  ;; => 5 (equivalent to (divide 10 2))
```
