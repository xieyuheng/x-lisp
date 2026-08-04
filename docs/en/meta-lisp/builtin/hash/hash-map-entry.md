---
title: hash-map-entry
---

# Type

```meta-lisp
(polymorphic (K1 V1 K2 V2)
  (-> (-> (pair-t K1 V1) (pair-t K2 V2))
      (hash-t K1 V1)
      (hash-t K2 V2)))
```

# Description

Map a function over entries.

# Examples

```meta-lisp
(hash-map-entry
  (lambda (e)
    (make-pair
      (iadd 1 (pair-first e))
      (iadd 1 (pair-second e))))
  (@hash 1 2 3 4))
;; => (@hash 2 3 4 5)
```
