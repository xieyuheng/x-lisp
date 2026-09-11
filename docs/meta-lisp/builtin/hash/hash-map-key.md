---
title: hash-map-key
---

# Type

```meta-lisp
(all (K1 K2 V) (-> (hash-t K1 V) (-> K1 K2) (hash-t K2 V)))
```

# Description

Map a function over keys, leaving values unchanged.

# Examples

```meta-lisp
(hash-map-key (@hash 'a 1 'b 2) symbol->text)
;; => (@hash "a" 1 "b" 2)
```
