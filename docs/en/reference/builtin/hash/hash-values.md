---
title: hash-values
---

# Type

```scheme
(polymorphic (K V) (-> (hash-t K V) (list-t V)))
```

# Description

Get all values of a hash table as a list.

# Examples

```scheme
(hash-values (@hash 1 2 3 4))  ;; => [2 4]
```
