---
title: hash-length
---

# Type

```scheme
(polymorphic (K V) (-> (hash-t K V) int-t))
```

# Description

Number of key-value entries in the hash table.

# Examples

```scheme
(hash-length (@hash "a" 1 "b" 2))  ;; => 2
```
