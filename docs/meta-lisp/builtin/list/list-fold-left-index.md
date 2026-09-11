---
title: list-fold-left-index
---

# Type

```meta-lisp
(all (E R) (-> (list-t E) R (-> int-t R E R) R))
```

# Description

Left fold with index. The callback receives the index, the folded value, and the current element, in that order.

# Examples

```meta-lisp
(list-fold-left-index (@list 10 20 30) 0 (lambda (i folded x) (iadd folded (imul i x))))
;; => 80

(list-fold-left-index (@list 'a 'b 'c) (@list) (lambda (i folded _) (cons i folded)))
;; => (@list 2 1 0)
```
