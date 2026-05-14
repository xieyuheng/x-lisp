---
title: hash-delete!
---

# Type

```scheme
(polymorphic (K V) (-> K (hash-t K V) (hash-t K V)))
```

# Description

Delete a key-value pair, returning a new hash table.

# Examples

```scheme
(hash-delete! "a" (@hash "a" 1 "b" 2))  ;; => (@hash "b" 2)
```
