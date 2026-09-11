---
title: list-map-concat
---

# Type

```meta-lisp
(all (A B) (-> (list-t A) (-> A (list-t B)) (list-t B)))
```

# Description

Applies function `f` to each element in the list, then flattens the results by one level. This is equivalent to `(list-concat (list-map f xs))`.

# Examples

```meta-lisp
(list-map-concat (@list 1 3) (lambda (x) (@list x (iadd x 1))))  ;; => (@list 1 2 3 4)
(list-map-concat (@list 1 2 3) (lambda (x) (@list)))           ;; => (@list)
(list-map-concat (@list (@list 1 2 3) (@list 4 5 6)) list-copy-reverse)    ;; => (@list 3 2 1 6 5 4)
```
