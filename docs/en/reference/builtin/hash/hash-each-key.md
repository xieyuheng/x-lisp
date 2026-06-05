---
title: hash-each-key
---

# Type

```scheme
(polymorphic (K V Any) (-> (-> K Any) (hash-t K V) void-t))
```

# Description

Iterate over each key with side effects.

# Examples

```scheme
(hash-each-key
  (lambda (key) (println key))
  (@hash 1 2 3 4))
```
