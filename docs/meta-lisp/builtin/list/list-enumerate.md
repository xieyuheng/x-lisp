---
title: list-enumerate
---

# Type

```meta-lisp
(all (A) (-> (list-t A) (list-t (pair-t int-t A))))
```

# Description

Pair each element in the list with its index.

# Examples

```meta-lisp
(list-enumerate (@list))            ;; => (@list)
(list-enumerate (@list 'a))          ;; => (@list (make-pair 0 'a))
(list-enumerate (@list 'a 'b 'c))    ;; => (@list (make-pair 0 'a) (make-pair 1 'b) (make-pair 2 'c))
```
