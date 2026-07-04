---
title: hash-map-value
---

# Type

```meta-lisp
(polymorphic (K V1 V2) (-> (-> V1 V2) (hash-t K V1) (hash-t K V2)))
```

# Description

Map a function over values, leaving keys unchanged.

# Examples

```meta-lisp
(hash-map-value (lambda (n) (iadd 10 n)) (@hash 'a 1 'b 2))
;; => (@hash 'a 11 'b 12)
```
