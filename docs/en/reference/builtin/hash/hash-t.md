---
title: hash-t
---

# Type

```scheme
(-> type-t type-t type-t)
```

# Description

Hash table type constructor. `(hash-t K V)` represents a hash table with key type `K` and value type `V`.

# Examples

```scheme
(claim scores (hash-t string-t int-t))
(hash-get "alice" (@hash "alice" 95 "bob" 87))  ;; => 95
```
