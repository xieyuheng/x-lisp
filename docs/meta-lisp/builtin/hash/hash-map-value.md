---
title: hash-map-value
---

# Type

```meta-lisp
(all (K V1 V2) (-> (hash-t K V1) (-> V1 V2) (hash-t K V2)))
```

# Description

Map a function over values, leaving keys unchanged.

# Examples

```meta-lisp
(hash-map-value (@hash 'a 1 'b 2) (lambda (n) (iadd 10 n)))
;; => (@hash 'a 11 'b 12)
```
