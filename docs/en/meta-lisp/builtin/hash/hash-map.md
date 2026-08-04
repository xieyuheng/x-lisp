---
title: hash-map
---

# Type

```meta-lisp
(polymorphic (K1 V1 K2 V2)
  (-> (-> K1 V1 (pair-t K2 V2))
      (hash-t K1 V1)
      (hash-t K2 V2)))
```

# Description

Map a function over keys and values, producing new entries.

# Examples

```meta-lisp
(hash-map
  (lambda (k v) (make-pair (iadd 1 k) (iadd 1 v)))
  (@hash 1 2 3 4))
;; => (@hash 2 3 4 5)
```
