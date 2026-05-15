---
title: hash-keys
---

# Type

```scheme
(polymorphic (K V) (-> (hash-t K V) (list-t K)))
```

# Description

Get all keys of a hash table as a list.

# Examples

```scheme
(hash-keys (@hash 1 2 3 4))  ;; => [1 3]
```
