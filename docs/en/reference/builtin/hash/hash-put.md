---
title: hash-put
---

# Type

```scheme
(polymorphic (K V) (-> K V (hash-t K V) (hash-t K V)))
```

# Description

Set a key-value pair, returning a new hash table.

# Examples

```scheme
(hash-put "c" 3 (@hash "a" 1 "b" 2))  ;; => (@hash "a" 1 "b" 2 "c" 3)
```
