---
title: hash-put!
---

# Type

```scheme
(polymorphic (K V) (-> K V (hash-t K V) (hash-t K V)))
```

# Description

Set a key-value pair, same as `hash-put`.

# Examples

```scheme
(hash-put! "c" 3 (@hash "a" 1 "b" 2))
```
