---
title: list-fold-right-index
---

# Type

```scheme
(polymorphic (E R) (-> (-> int-t E R R) R (list-t E) R))
```

# Description

Right fold with index. The callback receives the index, the current element, and the accumulator, in that order.

# Examples

```scheme
(list-fold-right-index (lambda (i x acc) (cons (make-pair i x) acc)) [] ['a 'b 'c])
;; => [(make-pair 0 'a) (make-pair 1 'b) (make-pair 2 'c)]

(list-fold-right-index (lambda (i x acc) (iadd (imul i x) acc)) 0 [10 20 30])
;; => 80
```
