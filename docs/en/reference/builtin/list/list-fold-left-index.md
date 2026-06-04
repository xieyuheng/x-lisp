---
title: list-fold-left-index
---

# Type

```scheme
(polymorphic (E R) (-> (-> int-t R E R) R (list-t E) R))
```

# Description

Left fold with index. The callback receives the index, the accumulator, and the current element, in that order.

# Examples

```scheme
(list-fold-left-index (lambda (i acc x) (iadd acc (imul i x))) 0 [10 20 30])
;; => 80

(list-fold-left-index (lambda (i acc _) (cons i acc)) [] ['a 'b 'c])
;; => [2 1 0]
```
