---
title: hash-copy
---

# Type

```scheme
(polymorphic (K V) (-> (hash-t K V) (hash-t K V)))
```

# Description

Copy a hash table, returning a new hash table.

# Examples

```scheme
(hash-copy (@hash "a" 1 "b" 2))
```
