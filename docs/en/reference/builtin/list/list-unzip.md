---
title: list-unzip
---

# Type

```scheme
(polymorphic (A B) (-> (list-t (pair-t A B)) (pair-t (list-t A) (list-t B))))
```

# Description

Split a list of pairs into two lists. Derived function.

# Examples

```scheme
(list-unzip [(make-pair 'a 1) (make-pair 'b 2)])  ;; => (make-pair ['a 'b] [1 2])
```
