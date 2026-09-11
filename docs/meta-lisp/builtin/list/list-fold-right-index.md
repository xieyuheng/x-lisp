---
title: list-fold-right-index
---

# Type

```meta-lisp
(all (E R) (-> (list-t E) R (-> int-t E R R) R))
```

# Description

Right fold with index. The callback receives the index, the current element, and the folded value, in that order.

# Examples

```meta-lisp
(list-fold-right-index (@list 'a 'b 'c) (@list) (lambda (i x folded) (cons (make-pair i x) folded)))
;; => (@list (make-pair 0 'a) (make-pair 1 'b) (make-pair 2 'c))

(list-fold-right-index (@list 10 20 30) 0 (lambda (i x folded) (iadd (imul i x) folded)))
;; => 80
```
