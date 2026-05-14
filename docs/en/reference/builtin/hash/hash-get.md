---
title: hash-get
---

# Type

```scheme
(polymorphic (K V) (-> K (hash-t K V) V))
```

# Description

Get value by key. Raises an error if the key does not exist.

# Examples

```scheme
(hash-get "a" (@hash "a" 1 "b" 2))  ;; => 1
```
