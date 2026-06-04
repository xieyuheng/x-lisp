---
title: list-map-index
---

# Type

```scheme
(polymorphic (A B) (-> (-> int-t A B) (list-t A) (list-t B)))
```

# Description

Map a function over each element together with its index.

# Examples

```scheme
(list-map-index (lambda (i x) (iadd i x)) [10 20 30])  ;; => [10 21 32]
(list-map-index (lambda (i _) i) ['a 'b 'c])            ;; => [0 1 2]
```
