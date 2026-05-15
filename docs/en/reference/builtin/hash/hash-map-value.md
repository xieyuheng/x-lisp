---
title: hash-map-value
---

# Type

```scheme
(polymorphic (K V1 V2) (-> (-> V1 V2) (hash-t K V1) (hash-t K V2)))
```

# Description

Map a function over values, leaving keys unchanged.

# Examples

```scheme
(hash-map-value (iadd 1) (@hash 1 2 3 4))  ;; => (@hash 1 3 3 5)
```
