---
title: hash-empty?
---

# Type

```scheme
(polymorphic (K V) (-> (hash-t K V) bool-t))
```

# Description

Check if the hash table is empty.

# Examples

```scheme
(hash-empty? (make-hash))   ;; => true
```
