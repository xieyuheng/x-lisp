---
title: hash-map-key
---

# Type

```scheme
(polymorphic (K1 K2 V) (-> (-> K1 K2) (hash-t K1 V) (hash-t K2 V)))
```

# Description

Map a function over keys, leaving values unchanged.

# Examples

```scheme
(hash-map-key (iadd 1) (@hash 1 2 3 4))  ;; => (@hash 2 2 4 4)
```
