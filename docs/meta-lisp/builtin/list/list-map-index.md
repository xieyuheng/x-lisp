---
title: list-map-index
---

# Type

```meta-lisp
(all (A B) (-> (list-t A) (-> int-t A B) (list-t B)))
```

# Description

Map a function over each element together with its index.

# Examples

```meta-lisp
(list-map-index (@list 10 20 30) (lambda (i x) (iadd i x)))  ;; => (@list 10 21 32)
(list-map-index (@list 'a 'b 'c) (lambda (i _) i))            ;; => (@list 0 1 2)
```
