---
title: list-fold-left-index
---

# Type

```scheme
(polymorphic (E R) (-> (-> int-t R E R) R (list-t E) R))
```

# Description

Left fold with index. The callback receives the index, the folded value, and the current element, in that order.

# Examples

```scheme
(list-fold-left-index (lambda (i folded x) (iadd folded (imul i x))) 0 [10 20 30])
;; => 80

(list-fold-left-index (lambda (i folded _) (cons i folded)) [] ['a 'b 'c])
;; => [2 1 0]
```
