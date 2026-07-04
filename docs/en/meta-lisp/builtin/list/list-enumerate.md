---
title: list-enumerate
---

# Type

```meta-lisp
(polymorphic (A) (-> (list-t A) (list-t (pair-t int-t A))))
```

# Description

Pair each element in the list with its index.

# Examples

```meta-lisp
(list-enumerate [])            ;; => []
(list-enumerate ['a])          ;; => [(make-pair 0 'a)]
(list-enumerate ['a 'b 'c])    ;; => [(make-pair 0 'a) (make-pair 1 'b) (make-pair 2 'c)]
```
