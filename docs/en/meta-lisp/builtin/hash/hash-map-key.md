---
title: hash-map-key
---

# Type

```meta-lisp
(polymorphic (K1 K2 V) (-> (-> K1 K2) (hash-t K1 V) (hash-t K2 V)))
```

# Description

Map a function over keys, leaving values unchanged.

# Examples

```meta-lisp
(hash-map-key symbol->string (@hash 'a 1 'b 2))
;; => (@hash "a" 1 "b" 2)
```
