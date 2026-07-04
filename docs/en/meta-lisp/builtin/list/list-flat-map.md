---
title: list-flat-map
---

# Type

```meta-lisp
(polymorphic (A B) (-> (-> A (list-t B)) (list-t A) (list-t B)))
```

# Description

Applies function `f` to each element in the list, then flattens the results by one level. This is equivalent to `(list-concat (list-map f xs))`.

# Examples

```meta-lisp
(list-flat-map (lambda (x) [x (iadd x 1)]) [1 3])  ;; => [1 2 3 4]
(list-flat-map (lambda (x) []) [1 2 3])           ;; => []
(list-flat-map list-reverse [[1 2 3] [4 5 6]])    ;; => [3 2 1 6 5 4]
```
