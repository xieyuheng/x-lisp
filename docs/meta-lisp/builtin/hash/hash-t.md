---
title: hash-t
---

# Type

```meta-lisp
type-t
```

# Description

Hash table type constructor. `(hash-t K V)` represents a hash table with key type `K` and value type `V`.

# Examples

```meta-lisp
(claim scores (hash-t text-t int-t))
(hash-get "alice" (@hash "alice" 95 "bob" 87))  ;; => 95
```
