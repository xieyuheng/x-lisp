---
title: list-map-concat
---

# Type

```meta-lisp
(all (A B) (-> (-> A (list-t B)) (list-t A) (list-t B)))
```

# Description

Applies function `f` to each element in the list, then flattens the results by one level. This is equivalent to `(list-concat (list-map f xs))`.

# Examples

```meta-lisp
(list-map-concat (lambda (x) (@list x (iadd x 1))) (@list 1 3))  ;; => (@list 1 2 3 4)
(list-map-concat (lambda (x) (@list)) (@list 1 2 3))           ;; => (@list)
(list-map-concat list-copy-reverse (@list (@list 1 2 3) (@list 4 5 6)))    ;; => (@list 3 2 1 6 5 4)
```
